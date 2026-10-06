import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  InputBase,
  Rating,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseRounded from "@mui/icons-material/CloseRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import DoneRounded from "@mui/icons-material/DoneRounded";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import { ProviderAvatar } from "./ProviderAvatar";
import { useSocket, useSocketEvent } from "../context/SocketContext";
import { api } from "../lib/api";
import { storage } from "../lib/storage";
import { clockTime, firstName, telHref } from "../lib/format";
import { tokens } from "../theme";

const NAME_KEY = "nearby.customerName";
const RATED_KEY = "nearby.rated";

// Conversation state for the customer side. Lives in the search page, not the
// drawer, so replies that arrive while the drawer is closed aren't lost.
export function useCustomerChats() {
  const { socket } = useSocket();
  const [threads, setThreads] = useState({});

  const patch = useCallback((providerId, fn) => {
    setThreads((all) => {
      const current = all[providerId] || { messages: [], typing: false, unread: 0 };
      return { ...all, [providerId]: fn(current) };
    });
  }, []);

  const typingTimers = useRef({});

  useSocketEvent(
    "chat:message",
    useCallback(
      (msg) => {
        if (msg.from !== "provider") return;
        patch(msg.providerId, (t) => ({
          ...t,
          typing: false,
          unread: t.unread + 1,
          messages: [...t.messages, { id: `${msg.at}-${Math.random()}`, from: "provider", body: msg.body, at: msg.at }],
        }));
      },
      [patch],
    ),
  );

  useSocketEvent(
    "chat:typing",
    useCallback(
      ({ providerId }) => {
        if (!providerId) return;
        patch(providerId, (t) => ({ ...t, typing: true }));
        clearTimeout(typingTimers.current[providerId]);
        typingTimers.current[providerId] = setTimeout(() => patch(providerId, (t) => ({ ...t, typing: false })), 3000);
      },
      [patch],
    ),
  );

  const send = useCallback(
    (providerId, body, name) =>
      new Promise((resolve) => {
        const id = `${Date.now()}-${Math.random()}`;
        patch(providerId, (t) => ({
          ...t,
          messages: [...t.messages, { id, from: "customer", body, at: Date.now(), status: "sending" }],
        }));
        const finish = (status, reason) => {
          patch(providerId, (t) => ({
            ...t,
            messages: t.messages.map((m) => (m.id === id ? { ...m, status } : m)),
          }));
          resolve({ status, reason });
        };
        if (!socket?.connected) return finish("failed", "disconnected");
        socket.timeout(8000).emit("chat:send", { providerId, body, name }, (err, ack) => {
          if (err) return finish("failed", "timeout");
          finish(ack?.delivered ? "delivered" : "failed", ack?.reason);
        });
      }),
    [socket, patch],
  );

  const retry = useCallback(
    (providerId, message, name) => {
      patch(providerId, (t) => ({ ...t, messages: t.messages.filter((m) => m.id !== message.id) }));
      return send(providerId, message.body, name);
    },
    [patch, send],
  );

  const markRead = useCallback((providerId) => patch(providerId, (t) => ({ ...t, unread: 0 })), [patch]);
  const typing = useCallback((providerId) => socket?.emit("chat:typing", { providerId }), [socket]);

  return { threads, send, retry, markRead, typing };
}

function StatusLine({ message, onRetry }) {
  if (message.from !== "customer") return null;
  const states = {
    sending: { icon: <ScheduleRounded sx={{ fontSize: 13 }} />, text: "Sending" },
    delivered: { icon: <DoneRounded sx={{ fontSize: 13 }} />, text: "Delivered" },
    failed: { icon: <ErrorOutlineRounded sx={{ fontSize: 13 }} />, text: "Not delivered" },
  };
  const s = states[message.status] || states.delivered;
  return (
    <Stack
      direction="row"
      sx={{
        gap: 0.5,
        alignItems: "center",
        justifyContent: "flex-end",
        mt: 0.25,
        color: message.status === "failed" ? "error.main" : "text.secondary",
      }}
    >
      {s.icon}
      <Typography variant="caption">{s.text}</Typography>
      {message.status === "failed" && (
        <Button size="small" onClick={onRetry} sx={{ minWidth: 0, p: 0, ml: 0.5, fontSize: 12 }}>
          Retry
        </Button>
      )}
    </Stack>
  );
}

export function TypingDots() {
  return (
    <Box
      sx={{ display: "inline-flex", gap: 0.5, px: 1.5, py: 1.25, bgcolor: "#efece5", borderRadius: 3 }}
      aria-label="typing"
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#8a857b",
            animation: "blink 1.2s infinite",
            animationDelay: `${i * 0.15}s`,
            "@keyframes blink": { "0%, 80%, 100%": { opacity: 0.3 }, "40%": { opacity: 1 } },
          }}
        />
      ))}
    </Box>
  );
}

export function Bubble({ mine, children }) {
  return (
    <Box
      sx={{
        maxWidth: "82%",
        alignSelf: mine ? "flex-end" : "flex-start",
        px: 1.75,
        py: 1.1,
        borderRadius: 3,
        borderBottomRightRadius: mine ? 6 : undefined,
        borderBottomLeftRadius: mine ? undefined : 6,
        bgcolor: mine ? tokens.forest : "#efece5",
        color: mine ? "#fff" : tokens.ink,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        animation: "rise .18s ease-out both",
      }}
    >
      {children}
    </Box>
  );
}

function RatePrompt({ provider, onRated }) {
  const [rated, setRated] = useState(() => storage.get(RATED_KEY, []).includes(provider._id));
  const [justRated, setJustRated] = useState(false);
  const [error, setError] = useState("");

  if (rated && !justRated) return null;

  const submit = async (score) => {
    setError("");
    try {
      const result = await api(`/services/${provider._id}/ratings`, { method: "POST", body: { score } });
      storage.set(RATED_KEY, [...storage.get(RATED_KEY, []), provider._id]);
      setRated(true);
      setJustRated(true);
      onRated?.(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ mx: 2, mb: 1.5, p: 1.5, borderRadius: 3, bgcolor: "#fdf6e3", border: "1px solid #f3e2b3" }}>
      {justRated ? (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Thanks! Your rating helps your neighbours choose.
        </Typography>
      ) : (
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            How was {firstName(provider.serviceRendererName)}?
          </Typography>
          <Rating onChange={(_, v) => v && submit(v)} size="medium" />
        </Stack>
      )}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}

export function ChatDrawer({ provider, open, onClose, chats, onRated }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [draft, setDraft] = useState("");
  const [name, setName] = useState(() => storage.get(NAME_KEY, ""));
  const [notice, setNotice] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const lastTyping = useRef(0);

  const providerId = provider?._id;
  const thread = (providerId && chats.threads[providerId]) || { messages: [], typing: false, unread: 0 };
  const first = firstName(provider?.serviceRendererName);
  const online = provider?.online;
  const hasReply = thread.messages.some((m) => m.from === "provider");

  useEffect(() => {
    if (open && providerId && thread.unread) chats.markRead(providerId);
  }, [open, providerId, thread.unread, chats]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.messages.length, thread.typing]);

  useEffect(() => setNotice(""), [providerId]);

  if (!provider) return null;

  const send = async (text = draft) => {
    const body = text.trim();
    if (!body || !online) return;
    setDraft("");
    storage.set(NAME_KEY, name.trim());
    const { status, reason } = await chats.send(providerId, body, name.trim());
    if (status === "failed" && reason === "offline") setNotice(`${first} just went offline. Calling is your best bet.`);
    inputRef.current?.focus();
  };

  // Opening lines remove the blank-page hesitation of a first message
  const starters = [
    `Hi ${first}, are you available today?`,
    `How much do you charge for ${provider.services.toLowerCase()}?`,
    "Can you come to me this week?",
  ];

  return (
    <Drawer
      anchor={mobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: mobile ? "100%" : 420,
            height: mobile ? "88dvh" : "100%",
            borderTopLeftRadius: mobile ? 20 : 0,
            borderTopRightRadius: mobile ? 20 : 0,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, p: 2, borderBottom: 1, borderColor: "divider" }}>
        <ProviderAvatar name={provider.serviceRendererName} online={online} size={44} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {provider.serviceRendererName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: thread.typing ? "primary.main" : online ? "success.main" : "text.secondary", fontWeight: 600 }}
          >
            {thread.typing ? "typing…" : online ? "Online now" : "Offline"} · {provider.services}
          </Typography>
        </Box>
        <Tooltip title={`Call ${first}`}>
          <IconButton href={telHref(provider.phoneNumber)} aria-label={`Call ${first}`} sx={{ bgcolor: "#efece5" }}>
            <PhoneRounded />
          </IconButton>
        </Tooltip>
        <IconButton onClick={onClose} aria-label="Close chat">
          <CloseRounded />
        </IconButton>
      </Stack>

      <Box ref={listRef} sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {thread.messages.length === 0 && (
          <Box sx={{ my: "auto", textAlign: "center", px: 2 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {online ? `Say hi to ${first}` : `${first} is offline right now`}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
              {online
                ? "They're online and can reply instantly. No account needed. They'll only see the name you choose."
                : "Messages only reach pros while they're online. A quick call is the fastest way to reach them."}
            </Typography>
            {online ? (
              <Stack sx={{ gap: 1, alignItems: "center" }}>
                {starters.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onClick={() => send(s)}
                    variant="outlined"
                    sx={{ height: "auto", py: 0.75, "& .MuiChip-label": { whiteSpace: "normal" } }}
                  />
                ))}
              </Stack>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<PhoneRounded />}
                href={telHref(provider.phoneNumber)}
              >
                Call {first}
              </Button>
            )}
          </Box>
        )}

        {thread.messages.map((m, i) => {
          const mine = m.from === "customer";
          const showTime = i === 0 || m.at - thread.messages[i - 1].at > 5 * 60 * 1000;
          return (
            <Box key={m.id} sx={{ display: "flex", flexDirection: "column" }}>
              {showTime && (
                <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary", my: 1 }}>
                  {clockTime(m.at)}
                </Typography>
              )}
              <Bubble mine={mine}>{m.body}</Bubble>
              {/* Status under the latest message, plus any that failed */}
              {mine && (i === thread.messages.length - 1 || m.status === "failed") && (
                <StatusLine message={m} onRetry={() => chats.retry(providerId, m, name.trim())} />
              )}
            </Box>
          );
        })}
        {thread.typing && <TypingDots />}
      </Box>

      {hasReply && <RatePrompt provider={provider} onRated={onRated} />}

      {notice && (
        <Alert severity="info" sx={{ mx: 2, mb: 1 }} onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {online && (
        <Box sx={{ p: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
          {thread.messages.length === 0 && (
            <InputBase
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder="Your first name (optional)"
              sx={{ width: "100%", fontSize: 14, mb: 1, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: "#f5f3ee" }}
              inputProps={{ "aria-label": "Your first name" }}
            />
          )}
          <Stack
            direction="row"
            sx={{
              alignItems: "flex-end",
              gap: 1,
              p: 0.75,
              pl: 2,
              borderRadius: 4,
              border: 1,
              borderColor: "divider",
              "&:focus-within": { borderColor: tokens.forest },
            }}
          >
            <InputBase
              inputRef={inputRef}
              autoFocus={!mobile}
              multiline
              maxRows={5}
              value={draft}
              placeholder={`Message ${first}…`}
              onChange={(e) => {
                setDraft(e.target.value);
                if (Date.now() - lastTyping.current > 1500) {
                  lastTyping.current = Date.now();
                  chats.typing(providerId);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              sx={{ flex: 1, py: 0.75 }}
              inputProps={{ "aria-label": `Message ${first}` }}
            />
            <IconButton
              onClick={() => send()}
              disabled={!draft.trim()}
              aria-label="Send"
              sx={{
                bgcolor: tokens.forest,
                color: "#fff",
                "&:hover": { bgcolor: "#164f3c" },
                "&.Mui-disabled": { bgcolor: "#e7e3da", color: "#fff" },
              }}
            >
              <ArrowUpwardRounded />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}
