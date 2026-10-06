const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const ServiceProviderDao = require("../dao/service-provider.dao");
const Authentication = require("../middleware/authentication");
const Authorization = require("../middleware/authorization");
const { geocodeAddress } = require("../utils/geocoder");
const { ratings } = require("../utils/helperfuctions");
const { secretKey } = require("../config");

const { Router } = express;

const SALT_ROUNDS = 10;
const MIN_RADIUS = 100;
const MAX_RADIUS = 50000;
const DEFAULT_RADIUS = 5000;

const ok = (res, payload, status = 200) => res.status(status).json({ response: true, payload });
const fail = (res, payload, status = 400) => res.status(status).json({ response: false, payload });

const signToken = (user) =>
  jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, userType: user.userType },
    secretKey,
    { expiresIn: "7d" }
  );

const normalisePhone = (phone) => String(phone || "").replace(/[\s()-]/g, "");

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const ratingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

module.exports = ({ presence, notifyProvider }) => {
  const api = Router();
  const providerOnly = [Authentication, Authorization(["serviceProvider"])];

  const withPresence = async (providers) => {
    const online = await presence.onlineMap(providers.map((p) => String(p._id)));
    return providers.map((p) => ({ ...p, online: online[String(p._id)] }));
  };

  // Body: { service, meters, lng, lat } or { service, meters, address }
  const search = async (req, res) => {
    const { service, address } = req.body;
    let { lng, lat } = req.body;

    if (!service || !String(service).trim()) return fail(res, "Tell us what service you need");

    const meters = Math.min(
      Math.max(parseInt(req.body.meters, 10) || DEFAULT_RADIUS, MIN_RADIUS),
      MAX_RADIUS
    );

    let resolvedAddress;
    if (address) {
      ({ lng, lat, formattedAddress: resolvedAddress } = await geocodeAddress(address));
    }
    lng = Number(lng);
    lat = Number(lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return fail(res, "Share your location or type an address to search near");
    }

    const term = String(service).trim();
    const results = await ServiceProviderDao.getRequiredServiceProviders(term, lng, lat, meters);

    // When nothing is in range, tell the client how far the closest match is so
    // it can offer a one-tap "widen search" instead of a dead end.
    let nearest = null;
    if (!results.length) {
      const [closest] = await ServiceProviderDao.getRequiredServiceProviders(term, lng, lat, null, 1);
      if (closest) nearest = { distance: closest.distance };
    }

    return ok(res, {
      results: await withPresence(results),
      center: { lng, lat, address: resolvedAddress },
      meters,
      nearest,
    });
  };

  api.post("/search", search);
  // Kept for older clients; /search accepts an address too
  api.post("/searchaddr", search);

  api.get("/popular", async (req, res) => {
    ok(res, await ServiceProviderDao.getPopularServices());
  });

  // Registration signs the provider straight in, no separate login step
  api.post("/", authLimiter, async (req, res) => {
    const { serviceRendererName, services, bio, permanentAddress, password } = req.body;
    const phoneNumber = normalisePhone(req.body.phoneNumber);

    if (!serviceRendererName || !phoneNumber || !services || !permanentAddress || !password) {
      return fail(res, "Please fill in every field");
    }
    if (String(password).length < 6) return fail(res, "Password needs at least 6 characters");

    const { lng, lat, formattedAddress } = await geocodeAddress(permanentAddress);
    const user = await ServiceProviderDao.createServiceProvider({
      serviceRendererName,
      phoneNumber,
      services,
      bio,
      location: { type: "Point", coordinates: [lng, lat], formattedAddress },
      password: await bcrypt.hash(password, SALT_ROUNDS),
    });

    return ok(res, { user, token: signToken(user) }, 201);
  });

  api.post("/login", authLimiter, async (req, res) => {
    const phoneNumber = normalisePhone(req.body.phoneNumber);
    const { password } = req.body;
    if (!phoneNumber || !password) return fail(res, "Enter your phone number and password");

    const user = await ServiceProviderDao.getUserWithPassword(phoneNumber);
    // Same message for both cases so the endpoint doesn't reveal which numbers exist
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return fail(res, "That phone number and password don't match", 401);
    }
    return ok(res, { user, token: signToken(user) });
  });

  api.get("/me", providerOnly, async (req, res) => {
    const user = await ServiceProviderDao.getServiceProvider(req.user.id);
    if (!user) return fail(res, "Account not found", 404);
    const online = await presence.onlineMap([String(user._id)]);
    return ok(res, { ...user.toJSON(), online: online[String(user._id)] });
  });

  api.patch("/me", providerOnly, async (req, res) => {
    const updates = {};
    for (const key of ["serviceRendererName", "services", "bio"]) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.body.permanentAddress) {
      const { lng, lat, formattedAddress } = await geocodeAddress(req.body.permanentAddress);
      updates.location = { type: "Point", coordinates: [lng, lat], formattedAddress };
    }
    if (req.body.password) {
      if (String(req.body.password).length < 6) return fail(res, "Password needs at least 6 characters");
      updates.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    }
    const user = await ServiceProviderDao.updateServiceProvider(req.user.id, updates);
    if (!user) return fail(res, "Account not found", 404);
    return ok(res, user);
  });

  api.delete("/me", providerOnly, async (req, res) => {
    await ServiceProviderDao.deleteServiceProvider(req.user.id);
    return ok(res, "Account deleted");
  });

  api.get("/:id", async (req, res) => {
    const user = await ServiceProviderDao.getServiceProvider(req.params.id);
    if (!user) return fail(res, "Provider not found", 404);
    return ok(res, user);
  });

  // Body: { score } (1-5) or the five category scores
  api.post("/:id/ratings", ratingLimiter, async (req, res) => {
    const score = ratings(req.body);
    if (score < 1) return fail(res, "Pick a rating from 1 to 5 stars");

    const user = await ServiceProviderDao.addRating(req.params.id, score);
    if (!user) return fail(res, "Provider not found", 404);

    notifyProvider(String(user._id), "rating:updated", {
      rating: user.rating,
      ratingCount: user.ratingCount,
      score,
    });
    return ok(res, { rating: user.rating, ratingCount: user.ratingCount });
  });

  return api;
};
