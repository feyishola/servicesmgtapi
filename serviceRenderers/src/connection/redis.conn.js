const redis = require("redis");

module.exports = async () => {
  const redisPort = process.env.REDIS_PORT || 6379;
  const client = redis.createClient(redisPort);

  await client.connect();

  client.on("error", (err) => {
    console.log(err);
  });
  console.log("connected to redis successfully!");
  return client;
};
