const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const connectMongo = require("./connection/mongodb.conn");
const connectRedis = require("./connection/redis.conn");
const createPresence = require("./utils/presence");
const servicesRoutes = require("./routes/services.routes");
const errorHandler = require("./middleware/errorhandler");
const { port, secretKey, corsOrigin } = require("./config");

const MAX_MESSAGE_LENGTH = 1000;

const cleanText = (text) => String(text ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);

async function start() {
  await connectMongo();
  const presence = createPresence(await connectRedis());

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: corsOrigin } });

  const notifyProvider = async (providerId, event, body) => {
    const socketId = await presence.socketFor(providerId);
    if (socketId) io.to(socketId).emit(event, body);
  };

  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: "20kb" }));
  app.get("/health", (req, res) =>
    res.json({ status: "ok", mongo: mongoose.connection.readyState === 1 })
  );
  app.use("/api/v1/services", servicesRoutes({ presence, notifyProvider }));
  app.use((req, res) => res.status(404).json({ response: false, payload: "Route not found" }));
  app.use(errorHandler);

  // Providers connect with their JWT so we can mark them online; customers
  // connect anonymously and are identified only by their socket id.
  io.use((socket, next) => {
    const { token } = socket.handshake.auth || {};
    if (token) {
      try {
        const user = jwt.verify(token, secretKey);
        if (user.userType === "serviceProvider") socket.data.providerId = String(user.id);
      } catch {
        return next(new Error("session_expired"));
      }
    }
    next();
  });

  io.on("connection", async (socket) => {
    const { providerId } = socket.data;
    socket.data.conversations = new Set();

    if (providerId) {
      await presence.goOnline(providerId, socket.id);
      io.emit("presence:changed", { providerId, online: true });
    }

    // Customer -> provider. Acks tell the sender whether it was delivered live.
    socket.on("chat:send", async ({ providerId: to, body, name } = {}, ack = () => {}) => {
      const text = cleanText(body);
      if (!to || !text) return ack({ delivered: false, reason: "empty" });

      const target = await presence.socketFor(String(to));
      if (!target) return ack({ delivered: false, reason: "offline" });

      socket.data.conversations.add(target);
      io.to(target).emit("chat:message", {
        conversationId: socket.id,
        from: "customer",
        name: cleanText(name).slice(0, 40) || "Customer",
        body: text,
        at: Date.now(),
      });
      ack({ delivered: true, at: Date.now() });
    });

    // Provider -> customer, addressed by the customer's socket id
    socket.on("chat:reply", ({ conversationId, body } = {}, ack = () => {}) => {
      const text = cleanText(body);
      if (!socket.data.providerId) return ack({ delivered: false, reason: "unauthorised" });
      if (!conversationId || !text) return ack({ delivered: false, reason: "empty" });
      if (!io.sockets.sockets.has(conversationId)) return ack({ delivered: false, reason: "left" });

      io.to(conversationId).emit("chat:message", {
        providerId: socket.data.providerId,
        from: "provider",
        body: text,
        at: Date.now(),
      });
      ack({ delivered: true, at: Date.now() });
    });

    socket.on("chat:typing", async ({ providerId: to, conversationId } = {}) => {
      if (socket.data.providerId && conversationId) {
        io.to(conversationId).emit("chat:typing", { providerId: socket.data.providerId });
      } else if (to) {
        const target = await presence.socketFor(String(to));
        if (target) io.to(target).emit("chat:typing", { conversationId: socket.id });
      }
    });

    socket.on("disconnect", async () => {
      // Let providers know the customer closed the chat
      for (const target of socket.data.conversations) {
        io.to(target).emit("chat:left", { conversationId: socket.id });
      }
      const wentOffline = await presence.goOffline(socket.id);
      if (wentOffline) io.emit("presence:changed", { providerId: wentOffline, online: false });
    });
  });

  server.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start().catch((err) => {
  console.error("failed to start:", err.message);
  process.exit(1);
});
