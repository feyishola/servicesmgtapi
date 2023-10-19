const redis = require("redis");

module.exports = async () => {
  const redisPort = process.env.REDIS_PORT || 6379;
  const client = redis.createClient({
    url: "rediss://oregon-redis.render.com:6379",
    username: "red-cko5mpcve64s739t1d4g",
    password: "Lc3Rucy7nyGHNPIkyN5vGKsMXCRZnVR8",
  });

  await client.connect();

  // Test the connection

  client.on("ready", () => {
    console.log("connected to redis successfully!");
  });

  client.on("error", (err) => {
    console.log("Redis connection error", err);
  });

  return client;
};
