const consumerController = require("../controller/consumer.controller");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const microServiceConnector = require("../utils/nodefetch");

module.exports = () => {
  const api = Router();

  api.get("/", async (req, res) => {
    try {
      let response = await consumerController.getAllConsumers();

      res.status(200).json({ response: true, payload: response });
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.get("/:id", async (req, res) => {
    try {
      let id = req.params.id;
      let response = await consumerController.getSingleConsumer(id);
      res.status(200).json({ response: true, payload: response });
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.post("/", async (req, res) => {
    try {
      const {
        consumerName,
        phoneNumber,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        password,
      } = req.body;

      const saltRounds = 10;
      const newPassword = await bcrypt.hash(password, saltRounds);

      let response = await consumerController.createConsumer(
        consumerName,
        phoneNumber,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        newPassword
      );
      res.status(200).json({ response: true, payload: response });
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.post("/login", async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;

      if (phoneNumber && password) {
        const user = await consumerController.getUser(phoneNumber);

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

  api.post("/search", async (req, res) => {
    try {
      const { service, lng, lat, meters } = req.body;

      let body = {
        service,
        lng,
        lat,
        meters,
      };

      const services = await microServiceConnector(
        "http://localhost:5000/api/v1/services/search",
        "POST",
        body
      );

      console.log({ "gotten by consumer": services });

      if (services.response == true) {
        res.status(200).json({ response: true, payload: services.payload });
      } else {
        throw new error("error occurred getting services");
      }
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.post("/ratings", async (req, res) => {
    try {
      const {
        phoneNumber,
        timeliness,
        communication,
        valueForMoney,
        customerService,
        professionalism,
      } = req.body;

      let body = {
        phoneNumber,
        timeliness,
        communication,
        valueForMoney,
        customerService,
        professionalism,
      };

      const ratingResponse = await microServiceConnector(
        "http://localhost:5000/api/v1/services/ratings",
        "PATCH",
        body
      );

      if (ratingResponse.response == true) {
        res
          .status(200)
          .json({ response: true, payload: "Thank you for your ratings" });
      } else {
        throw new error("error occurred rating");
      }
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const {
        consumerName,
        phoneNumber,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        userType,
        password,
        services,
      } = req.body;

      const saltRounds = 10;
      const newPassword = await bcrypt.hash(password, saltRounds);
      let response = await consumerController.updateConsumer(
        id,
        consumerName,
        phoneNumber,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        userType,
        newPassword,
        services
      );

      res
        .status(200)
        .json({ response: true, payload: "Consumer record Updated" });
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const response = await consumerController.deleteConsumer(id);
      res.status(200).json({ response: true, payload: response });
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  return api;
};
