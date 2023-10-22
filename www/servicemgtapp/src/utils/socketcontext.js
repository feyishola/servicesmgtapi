import React from "react";

import { useState, createContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState();
  const [recipient, setRecipient] = useState();

  useEffect(() => {
    // const newSocket = io("http://127.0.0.1:5000");
    const newSocket = io("https://sample-project-kntm.onrender.com"); // Server Url goes here
    setSocket(newSocket);
    newSocket.on("socketId", (id) => {
      setId(id);
    });
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, id, setRecipient, recipient }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
