import React from "react";

import { useState, createContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState();

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:5000"); // Server Url goes here
    setSocket(newSocket);
    newSocket.on("socketId", (id) => {
      setId(id);
    });
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, id }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
