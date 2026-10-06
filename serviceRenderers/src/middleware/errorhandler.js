const { GeocodeError } = require("../utils/geocoder");

// Express 5 forwards rejected promises from async handlers here
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof GeocodeError) {
    return res.status(422).json({ response: false, payload: err.message });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)[0]?.message || "Invalid input";
    return res.status(400).json({ response: false, payload: message });
  }
  if (err.name === "CastError") {
    return res.status(404).json({ response: false, payload: "Not found" });
  }
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ response: false, payload: "That phone number is already registered. Try signing in instead" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ response: false, payload: "Malformed JSON" });
  }

  console.error(err);
  return res.status(500).json({ response: false, payload: "Something went wrong on our side" });
};
