const mongoose = require("mongoose");
const { mongoUri } = require("../config");

module.exports = async () => {
  mongoose.connection
    .on("connected", () => console.log("connected to mongodb"))
    .on("error", (err) => console.error("mongodb error:", err.message))
    .on("disconnected", () => console.warn("mongodb disconnected"));

  // mongoose retries on its own once the initial connection succeeds
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
};
