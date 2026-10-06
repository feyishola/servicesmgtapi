const NodeGeocoder = require("node-geocoder");
const { geocoder: options } = require("../config");

const USER_AGENT = "servicesmgtapi/2.0 (+https://github.com/feyishola/servicesmgtapi)";
const TIMEOUT_MS = 8000;

class GeocodeError extends Error {}

const getJson = async (url, timeout = TIMEOUT_MS) => {
  const res = await fetch(url, {
    // Nominatim's usage policy requires an identifying user agent
    headers: { "user-agent": USER_AGENT, accept: "application/json" },
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// Each provider resolves to { lng, lat, formattedAddress }, null for "no match",
// or throws when the service itself is unavailable.
// "Maitama, Abuja, Federal Capital Territory, Nigeria" rather than the nearest
// landmark Nominatim happened to match ("Embassy of …, 9, Maracaibo Close, …")
const areaLabel = (a = {}) =>
  [
    a.suburb || a.neighbourhood || a.quarter || a.city_district || a.road,
    a.city || a.town || a.village || a.county,
    a.state,
    a.country,
  ]
    .filter((part, i, all) => part && all.indexOf(part) === i)
    .join(", ");

const nominatim = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(address)}`;
  const [match] = await getJson(url);
  if (!match) return null;
  return { lng: Number(match.lon), lat: Number(match.lat), formattedAddress: areaLabel(match.address) || match.display_name };
};

// Photon (komoot) is a second keyless OpenStreetMap geocoder, used if Nominatim
// is down or rate-limits the server's IP. It's slower, so it gets more time, and
// it's limited to places and streets so "Wuse 2" doesn't match a shop at number 2.
const PHOTON_LAYERS = ["district", "locality", "city", "street"].map((l) => `&layer=${l}`).join("");
const photon = async (address) => {
  const { features = [] } = await getJson(
    `https://photon.komoot.io/api/?limit=1${PHOTON_LAYERS}&q=${encodeURIComponent(address)}`,
    15000
  );
  const [match] = features;
  if (!match) return null;
  const [lng, lat] = match.geometry.coordinates;
  const p = match.properties;
  const formattedAddress = [p.name, p.street, p.district, p.city, p.state, p.country]
    .filter((part, i, all) => part && all.indexOf(part) === i)
    .join(", ");
  return { lng, lat, formattedAddress };
};

// Any provider node-geocoder supports (google, mapquest, opencage, …) via env
const configured = (() => {
  if (!options.provider || options.provider === "openstreetmap") return null;
  const geocoder = NodeGeocoder({ provider: options.provider, apiKey: options.apiKey, formatter: null });
  return async (address) => {
    const [match] = (await geocoder.geocode(address)) || [];
    if (!match) return null;
    return {
      lng: match.longitude,
      lat: match.latitude,
      formattedAddress:
        match.formattedAddress ||
        [match.streetName, match.city, match.state, match.country].filter(Boolean).join(", "),
    };
  };
})();

const providers = [
  configured && { name: options.provider, lookup: configured },
  { name: "nominatim", lookup: nominatim },
  { name: "photon", lookup: photon },
].filter(Boolean);

// Resolves a free-text address to { lng, lat, formattedAddress }, trying each
// provider in turn, or throws a GeocodeError with a message safe to show users.
const geocodeAddress = async (address) => {
  let anyAnswered = false;
  for (const { name, lookup } of providers) {
    try {
      const result = await lookup(address);
      anyAnswered = true;
      if (result && Number.isFinite(result.lng) && Number.isFinite(result.lat)) return result;
    } catch (err) {
      console.warn(`geocoder "${name}" failed: ${err.message}`);
    }
  }
  if (anyAnswered) {
    throw new GeocodeError(`We couldn't find "${address}". Try adding the city or state.`);
  }
  throw new GeocodeError("We couldn't reach the location service. Please try again.");
};

module.exports = { geocodeAddress, GeocodeError };
