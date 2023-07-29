const express = require("express");
require("./connection/mongodb.conn")();
const http = require("http");
const routes = require("./routes/services.routes")();
const socketio = require("socket.io");
const cors = require("cors");

class AppServer {
  #io;
  constructor() {
    this.#init();
  }

  #init() {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use("/api/v1/services", routes);
    const server = http.createServer(app);
    this.#io = socketio(server, { cors: { allow: "*" } });

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`connected to ${PORT}`);
    });

    this.#io.on("connection", (socket) => {
      console.log("connected to socket.io");

      // Sending socket id to client
      socket.emit("socketId", socket.id);

      // listening for event

      socket.on("msgFromClient", (message) => {
        console.log("received from client", message);
        // brodcast from io to clients

        this.#io.emit("serverResponse", message);
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
