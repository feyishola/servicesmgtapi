require("dotenv").config({ quiet: true });

const required = ["MONGO_URI", "SECRET_KEY"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("Copy .env.example to .env and fill it in.");
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
  // Optional: without REDIS_URL, presence is kept in memory (fine for a single instance)
  redisUrl: process.env.REDIS_URL,
  corsOrigin: process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || "*",
  geocoder: {
    provider: process.env.GEOCODER_PROVIDER || "openstreetmap",
    apiKey: process.env.GEOCODER_API_KEY,
  },
};
