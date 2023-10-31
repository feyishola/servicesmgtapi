const redis = require("redis");

module.exports = async () => {
  const redisPort = process.env.REDIS_PORT || 6379;
  const client = redis.createClient({
    url: "rediss://oregon-redis.render.com:6379",
    username: "red-ckoj2c0ujous73eg1gv0",
    password: "CUq8rhCoCknwxxuMHZiOkod6moHl85TS",
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
