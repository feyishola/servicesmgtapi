const express = require("express");
const ServiceProviderDao = require("../dao/service-provider.dao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const geocoder = require("../utils/geocoder");
const Authentication = require("../middleware/authentication");
const Authorization = require("../middleware/authorization");
const serviceProviderDao = require("../dao/service-provider.dao");
const ratings = require("../utils/helperfuctions");
// const io = require("../app");
// const { getIoInstance } = require("../utils/socketinstance");

const { Router } = express;

module.exports = () => {
  const api = Router();

  api.get(
    "/",
    [Authentication, Authorization(["serviceProvider"])],
    async (req, res) => {
      try {
        let result = await ServiceProviderDao.getAllServiceProviders();
        res.status(200).json({ response: true, payload: result });
      } catch (error) {
        res.status(400).json({ response: false, payload: error.message });
      }
    }
  );

  api.post(`/search`, async (req, res) => {
    try {
      const { service, lng, lat, meters } = req.body;

      let result = await ServiceProviderDao.getRequiredServiceProviders(
        service,
        lng,
        lat,
        meters
      );
      // console.log({result});
      res.status(200).json({ response: true, payload: result });
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  api.post(`/searchaddr`, async (req, res) => {
    try {
      const { address, service, meters } = req.body;
      const addr = await geocoder.geocode(address);
      const lng = addr[0].longitude;
      const lat = addr[0].latitude;
      let result = await ServiceProviderDao.getRequiredServiceProviders(
        service,
        lng,
        lat,
        meters
      );
      // console.log({result});
      res.status(200).json({ response: true, payload: result });
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  api.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      let result = await ServiceProviderDao.getServiceProvider(id);
      res.status(200).json({ response: true, payload: result });
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  api.post("/", async (req, res) => {
    try {
      const {
        serviceRendererName,
        phoneNumber,
        services,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        ratings,
        password,
      } = req.body;

      const saltRounds = 10;

      const newPassword = await bcrypt.hash(password, saltRounds);

      const result = await ServiceProviderDao.createServiceProvider(
        serviceRendererName,
        phoneNumber,
        services,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        ratings,
        newPassword
      );

      res.status(200).json({ response: true, payload: result });
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  api.post("/login", async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;

      if (phoneNumber && password) {
        const user = await ServiceProviderDao.getUser(phoneNumber);

        if (user !== null) {
          let checkPassword = await bcrypt.compare(password, user.password);

          if (checkPassword) {
            let token = jwt.sign(
              { userName: user.userName, phoneNumber, userType: user.userType },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );

            res.status(200).json({ response: true, payload: { user, token } });
          } else {
            res
              .status(400)
              .json({ response: false, payload: "Password is incorrect" });
          }
        } else {
          res
            .status(400)
            .json({ response: false, payload: "Phone Number is incorrect" });
        }
      } else {
        res
          .status(400)
          .json({ response: false, payload: "Both inputs are required" });
      }
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const {
        phoneNumber,
        services,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        userType,
        password,
      } = req.body;
      const saltRounds = 10;
      const newPassword = await bcrypt.hash(password, saltRounds);
      const result = await ServiceProviderDao.updateServiceProvider(
        id,
        phoneNumber,
        services,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        userType,
        newPassword
      );
      res.status(200).json({ response: true, payload: "file updated" });
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  api.patch("/ratings", async (req, res) => {
    const {
      phoneNumber,
      timeliness,
      communication,
      valueForMoney,
      customerService,
      professionalism,
    } = req.body;

    try {
      const render = await serviceProviderDao.getUser(phoneNumber);

      if (render) {
        let response = ratings(
          timeliness,
          communication,
          valueForMoney,
          customerService,
          professionalism
        );
        // render.ratings = response;
        let result = await serviceProviderDao.rateUser(phoneNumber, response);

        //Emit the updated ratings value to all connected clients using Socket.IO
        // req.io.emit("ratingsUpdate", response);
        // const io = getIoInstance();

        require("../server").emitEvent("ratingsUpdate", response);

        // io.emit("ratingsUpdate", response);

        res.status(200).json({ response: true, payload: result });
      }
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  api.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ServiceProviderDao.deleteServiceProvider(id);
      res
        .status(200)
        .json({ response: true, payload: "user deleted successfully" });
    } catch (error) {
      res.status(400).json({ response: false, payload: error.message });
    }
  });

  return api;
};
