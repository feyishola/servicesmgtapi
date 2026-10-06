import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../lib/api";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({ socket: null, connected: false });

// One socket for the whole app. Signed-in providers connect with their token,
// which is what marks them "online" to customers.
export function SocketProvider({ children }) {
  const { token, signOut } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const next = io(API_URL, { auth: token ? { token } : {}, transports: ["websocket", "polling"] });
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err) => {
      if (err.message === "session_expired") signOut();
    };

    next.on("connect", onConnect);
    next.on("disconnect", onDisconnect);
    next.on("connect_error", onError);
    setSocket(next);

    return () => {
      next.off("connect", onConnect);
      next.off("disconnect", onDisconnect);
      next.off("connect_error", onError);
      next.close();
      setConnected(false);
    };
  }, [token, signOut]);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);

// Subscribes `handler` to a socket event for the lifetime of the component
export function useSocketEvent(event, handler) {
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket, event, handler]);
}
