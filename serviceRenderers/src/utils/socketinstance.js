const socketIo = require("socket.io");
const cors = require("cors");

let ioInstance;

function initializeIo(server) {
  ioInstance = socketIo(server, { cors: { allow: "*" } });
  return ioInstance;
}

function getIoInstance() {
  return ioInstance;
}

module.exports = { initializeIo, getIoInstance };

// class SocketService {
//   socketinstance;
//   constructor(server) {
//     this.io = socketIo(server, { cors: { allow: "*" } });
//     this.io.on("connection", (socket) => {
//       this.socketinstance = socket;
//       console.log("User connected");
//     });
//   }

//   emitter(event, body) {
//     if (body) this.io.emit(event, body);
//   }
// }

// module.exports = SocketService;
