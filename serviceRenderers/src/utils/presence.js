// Tracks which providers are connected and on which socket.
// Keys: presence:<providerId> -> socketId, socket:<socketId> -> providerId
module.exports = (store) => ({
  async goOnline(providerId, socketId) {
    await store.set(`presence:${providerId}`, socketId);
    await store.set(`socket:${socketId}`, providerId);
  },

  // Returns the provider id that was attached to the socket, if any
  async goOffline(socketId) {
    const providerId = await store.get(`socket:${socketId}`);
    await store.del(`socket:${socketId}`);
    if (!providerId) return null;
    // Only clear presence if a newer tab hasn't already taken over
    if ((await store.get(`presence:${providerId}`)) === socketId) {
      await store.del(`presence:${providerId}`);
      return providerId;
    }
    return null;
  },

  socketFor(providerId) {
    return store.get(`presence:${providerId}`);
  },

  providerFor(socketId) {
    return store.get(`socket:${socketId}`);
  },

  async onlineMap(providerIds) {
    const sockets = await Promise.all(providerIds.map((id) => store.get(`presence:${id}`)));
    return Object.fromEntries(providerIds.map((id, i) => [id, Boolean(sockets[i])]));
  },
});
