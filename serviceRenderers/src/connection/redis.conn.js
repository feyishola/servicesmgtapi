const redis = require("redis");
const { redisUrl } = require("../config");

// A tiny key/value store with the same async get/set/del shape as the redis
// client, used when REDIS_URL is not configured.
const memoryStore = () => {
  const map = new Map();
  return {
    get: async (key) => map.get(key) ?? null,
    set: async (key, value) => void map.set(key, value),
    del: async (key) => void map.delete(key),
  };
};

module.exports = async () => {
  if (!redisUrl) {
    console.log("REDIS_URL not set, using in-memory presence store");
    return memoryStore();
  }

  const client = redis.createClient({ url: redisUrl });
  client.on("error", (err) => console.error("redis error:", err.message));

  try {
    await client.connect();
    console.log("connected to redis");
    return client;
  } catch (err) {
    console.error("could not connect to redis, falling back to memory:", err.message);
    return memoryStore();
  }
};
