const express = require("express");
require("./connection/mongodb.conn")();
const http = require("http");
const routes = require("./routes/services.routes")();
const socketio = require("socket.io");
const cors = require("cors");
// const redis = require("redis");
const redis_client = require("./connection/redis.conn")();

class AppServer {
  #io;
  constructor() {
    this.#init();
  }

  async #init() {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use("/api/v1/services", routes);
    const server = http.createServer(app);
    this.#io = socketio(server, { cors: { allow: "*" } });

    const PORT = process.env.PORT || 5000;

    let redisCli;

    try {
      redisCli = await redis_client;
      // const key = "id";
    } catch (err) {
      console.error("failed to connect to redis", err);
      return;
    }

    server.listen(PORT, () => {
      console.log(`Server connected on port ${PORT}`);
    });

    this.#io.on("connection", (socket) => {
      console.log("connected to socket.io");

      // Sending socket id to client
      socket.emit("socketId", socket.id);

      // listening for event
      // setting the redisdb with phonenumber as key and socketid as value from login page
      socket.on("forRedis", (user, id) => {
        console.log(user, id);
        redisCli.set(user, id, (err, res) => {
          if (err) {
            console.log(err);
          }
        });
      });

      // using user(phone number) frm servicerenderingpage to search the redisdb for socketid
      socket.on("user", async (user) => {
        let res = await redisCli.get(user);
        if (res != null && res != undefined) {
          socket.emit("sockId", res);
        }
      });
      //test
      // socket.on("senderSockId", (res) => console.log({ sendersid: res }));

      socket.on("messageToClient", () => {});

      socket.on("msgFromClient", async (message, phone) => {
        let { recipientSockId, body } = message;

        if (recipientSockId) {
          socket.to(recipientSockId).emit("serverResponse", message);
          socket.emit("myMsg", message);
        } else {
          try {
            let recipientSockId2 = await redisCli.get(phone);
            console.log({ recipientSockId2 });
          } catch (err) {
            console.error("Redis error:", err);
          }
        }
      });

      socket.on("disconnect", () => {
        console.log("disconnected from socket");
      });
    });
  }

  emitEvent(event, body) {
    this.#io.emit(event, body);
  }
}

module.exports = new AppServer();
