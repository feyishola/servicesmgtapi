import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSocket, useSocketEvent } from "./SocketContext";

const InboxContext = createContext(null);

// Holds a provider's live conversations. Lives above the dashboard routes so
// messages that arrive while on the Overview tab are still there in the Inbox.
export function InboxProvider({ children }) {
  const { socket } = useSocket();
  const [conversations, setConversations] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [latest, setLatest] = useState(null);
  const typingTimers = useRef({});

  const patch = useCallback((id, fn) => {
    setConversations((all) => {
      const current = all[id] || { id, name: "Customer", messages: [], unread: 0, typing: false, left: false };
      return { ...all, [id]: fn(current) };
    });
  }, []);

  const onMessage = useCallback(
    (msg) => {
      if (msg.from !== "customer") return;
      patch(msg.conversationId, (c) => ({
        ...c,
        name: msg.name,
        typing: false,
        left: false,
        startedAt: c.startedAt || msg.at,
        messages: [...c.messages, { id: `${msg.at}-${Math.random()}`, from: "customer", body: msg.body, at: msg.at }],
        unread: activeId === msg.conversationId && document.visibilityState === "visible" ? 0 : c.unread + 1,
      }));
      setLatest({ conversationId: msg.conversationId, name: msg.name, body: msg.body, at: msg.at });
    },
    [patch, activeId],
  );

  const onTyping = useCallback(
    ({ conversationId }) => {
      if (!conversationId) return;
      patch(conversationId, (c) => ({ ...c, typing: true }));
      clearTimeout(typingTimers.current[conversationId]);
      typingTimers.current[conversationId] = setTimeout(
        () => patch(conversationId, (c) => ({ ...c, typing: false })),
        3000,
      );
    },
    [patch],
  );

  const onLeft = useCallback(
    ({ conversationId }) => patch(conversationId, (c) => ({ ...c, left: true, typing: false })),
    [patch],
  );

  useSocketEvent("chat:message", onMessage);
  useSocketEvent("chat:typing", onTyping);
  useSocketEvent("chat:left", onLeft);

  const markRead = useCallback((id) => patch(id, (c) => ({ ...c, unread: 0 })), [patch]);

  const reply = useCallback(
    (conversationId, body) => {
      const id = `${Date.now()}-${Math.random()}`;
      const message = { id, from: "provider", body, at: Date.now(), status: "sending" };
      patch(conversationId, (c) => ({ ...c, messages: [...c.messages, message] }));

      const setStatus = (status) =>
        patch(conversationId, (c) => ({
          ...c,
          left: status === "left" ? true : c.left,
          messages: c.messages.map((m) => (m.id === id ? { ...m, status } : m)),
        }));

      if (!socket?.connected) return setStatus("failed");
      socket.timeout(8000).emit("chat:reply", { conversationId, body }, (err, ack) => {
        if (err) return setStatus("failed");
        setStatus(ack?.delivered ? "delivered" : ack?.reason === "left" ? "left" : "failed");
      });
    },
    [socket, patch],
  );

  const sendTyping = useCallback((conversationId) => socket?.emit("chat:typing", { conversationId }), [socket]);

  const list = useMemo(
    () => Object.values(conversations).sort((a, b) => (b.messages.at(-1)?.at || 0) - (a.messages.at(-1)?.at || 0)),
    [conversations],
  );
  const totalUnread = list.reduce((sum, c) => sum + c.unread, 0);

  // "(2) Inbox" in the tab title, so providers notice from another tab
  useEffect(() => {
    const base = "Nearby for pros";
    document.title = totalUnread ? `(${totalUnread}) ${base}` : base;
    return () => {
      document.title = "Nearby: find trusted local pros";
    };
  }, [totalUnread]);

  const value = {
    conversations: list,
    byId: conversations,
    activeId,
    setActiveId,
    markRead,
    reply,
    sendTyping,
    totalUnread,
    latest,
  };
  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}

export const useInbox = () => useContext(InboxContext);
