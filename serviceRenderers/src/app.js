require("dotenv").config({ path: "../.env" });
const server = require("./server");

// const express = require("express");
// require("./connection/mongodb.conn")();
// const routes = require("./routes/services.routes")();
// const app = express();
// const cors = require("cors");

// trying to create a socket.io connection
// const http = require("http");
// const socketio = require("socket.io");
// const SocketService = require("./utils/socketinstance");

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(cors());

// const server = http.createServer(app);

// const io = socketio(server, { cors: { allow: "*" } });

// const io = require("./utils/socketinstance").initializeIo(server);

// Middleware to attach io to the request object

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// module.exports = { io };

// app.use("/api/v1/services", routes);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`connected to ${PORT}`);
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");

//   // listening for event

//   socket.on("msgFromClient", (message) => {
//     console.log(`received client message: ${message}`);

//     // brodcast from io to clients

//     io.emit("serverResponse", { data: "ur data from server" });
//   });

//   socket.on("disconnect", () => {
//     console.log("disconnected from socket");
//   });
// });
