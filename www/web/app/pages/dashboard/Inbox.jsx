import { useEffect, useRef, useState } from "react";
import { Box, IconButton, InputBase, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ForumRounded from "@mui/icons-material/ForumRounded";
import { ProviderAvatar } from "../../components/ProviderAvatar";
import { Bubble, TypingDots } from "../../components/ChatDrawer";
import { useInbox } from "../../context/InboxContext";
import { useSocket } from "../../context/SocketContext";
import { clockTime, timeAgo } from "../../lib/format";
import { tokens } from "../../theme";

function ConversationList({ conversations, activeId, onOpen }) {
  return (
    <Box sx={{ overflowY: "auto" }}>
      {conversations.map((c) => {
        const last = c.messages.at(-1);
        return (
          <Stack
            key={c.id}
            direction="row"
            component="button"
            onClick={() => onOpen(c.id)}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              width: "100%",
              display: "flex",
              gap: 1.5,
              p: 2,
              cursor: "pointer",
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: c.id === activeId ? "#f1eee8" : "transparent",
              "&:hover": { bgcolor: "#f6f4ef" },
              "&:focus-visible": { outline: `3px solid ${tokens.amber}`, outlineOffset: -3 },
            }}
          >
            <ProviderAvatar name={c.name} online={!c.left} size={42} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
                <Typography noWrap sx={{ fontWeight: c.unread ? 800 : 600 }}>
                  {c.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", flexShrink: 0 }}>
                  {last && timeAgo(last.at)}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ color: c.unread ? "text.primary" : "text.secondary", fontWeight: c.unread ? 600 : 400 }}
                >
                  {c.typing ? "typing…" : `${last?.from === "provider" ? "You: " : ""}${last?.body || ""}`}
                </Typography>
                {c.unread > 0 && (
                  <Box
                    sx={{
                      minWidth: 20,
                      height: 20,
                      px: 0.75,
                      borderRadius: 999,
                      bgcolor: tokens.amber,
                      fontSize: 12,
                      fontWeight: 800,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {c.unread}
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        );
      })}
    </Box>
  );
}

function Thread({ conversation, onBack }) {
  const { reply, sendTyping } = useInbox();
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const lastTyping = useRef(0);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation.messages.length, conversation.typing]);

  const send = () => {
    const body = draft.trim();
    if (!body || conversation.left) return;
    reply(conversation.id, body);
    setDraft("");
  };

  const statusText = { sending: "Sending", delivered: "Delivered", failed: "Not delivered", left: "Customer had left" };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, p: 2, borderBottom: 1, borderColor: "divider" }}>
        {onBack && (
          <IconButton onClick={onBack} aria-label="Back to conversations">
            <ArrowBackRounded />
          </IconButton>
        )}
        <ProviderAvatar name={conversation.name} online={!conversation.left} size={40} />
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{conversation.name}</Typography>
          <Typography
            variant="body2"
            sx={{ color: conversation.typing ? "primary.main" : "text.secondary", fontWeight: 600 }}
          >
            {conversation.typing ? "typing…" : conversation.left ? "Closed the chat" : "Here now"}
          </Typography>
        </Box>
      </Stack>

      <Box ref={listRef} sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {conversation.messages.map((m, i) => {
          const mine = m.from === "provider";
          const prev = conversation.messages[i - 1];
          return (
            <Box key={m.id} sx={{ display: "flex", flexDirection: "column" }}>
              {(!prev || m.at - prev.at > 5 * 60 * 1000) && (
                <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary", my: 1 }}>
                  {clockTime(m.at)}
                </Typography>
              )}
              <Bubble mine={mine}>{m.body}</Bubble>
              {mine && (i === conversation.messages.length - 1 || m.status === "failed" || m.status === "left") && (
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: "right",
                    color: m.status === "delivered" || m.status === "sending" ? "text.secondary" : "error.main",
                    mt: 0.25,
                  }}
                >
                  {statusText[m.status]}
                </Typography>
              )}
            </Box>
          );
        })}
        {conversation.typing && <TypingDots />}
        {conversation.left && (
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mt: 2 }}>
            {conversation.name} closed the chat. They have your number if they want to follow up.
          </Typography>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
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
            bgcolor: conversation.left ? "#f6f4ef" : "background.paper",
            "&:focus-within": { borderColor: tokens.forest },
          }}
        >
          <InputBase
            autoFocus
            multiline
            maxRows={5}
            disabled={conversation.left}
            value={draft}
            placeholder={conversation.left ? "This customer has left" : `Reply to ${conversation.name}…`}
            onChange={(e) => {
              setDraft(e.target.value);
              if (Date.now() - lastTyping.current > 1500) {
                lastTyping.current = Date.now();
                sendTyping(conversation.id);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            sx={{ flex: 1, py: 0.75 }}
            inputProps={{ "aria-label": "Reply" }}
          />
          <IconButton
            onClick={send}
            disabled={!draft.trim() || conversation.left}
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
    </Box>
  );
}

export function Inbox() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { conversations, byId, activeId, setActiveId, markRead } = useInbox();
  const { connected } = useSocket();
  const active = activeId ? byId[activeId] : null;

  // Opening a conversation (or a message arriving in the open one) clears its badge
  useEffect(() => {
    if (active?.unread) markRead(active.id);
  }, [active?.id, active?.unread, markRead]); // eslint-disable-line react-hooks/exhaustive-deps

  // On desktop, open the most recent conversation by default
  useEffect(() => {
    if (!mobile && !activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [mobile, activeId, conversations, setActiveId]);

  if (!conversations.length) {
    return (
      <Box sx={{ flex: 1, display: "grid", placeItems: "center", p: 3 }}>
        <Box sx={{ textAlign: "center", maxWidth: 380 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "#e6f0ea",
              color: tokens.forest,
            }}
          >
            <ForumRounded />
          </Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            No messages yet
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {connected
              ? "When someone nearby messages you, it'll pop up here instantly. Keep this tab open while you're available."
              : "You're offline right now. Messages will arrive here once you reconnect."}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        maxWidth: 1200,
        width: "100%",
        mx: "auto",
        px: { md: 3 },
        py: { md: 3 },
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "340px 1fr" },
          bgcolor: "background.paper",
          border: { md: 1 },
          borderColor: { md: "divider" },
          borderRadius: { md: 4 },
          overflow: "hidden",
          height: { xs: "calc(100dvh - 64px)", md: "calc(100dvh - 64px - 48px)" },
        }}
      >
        {(!mobile || !active) && (
          <Box
            sx={{
              borderRight: { md: 1 },
              borderColor: { md: "divider" },
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              Conversations
            </Typography>
            <ConversationList conversations={conversations} activeId={activeId} onOpen={setActiveId} />
          </Box>
        )}
        {active && <Thread key={active.id} conversation={active} onBack={mobile ? () => setActiveId(null) : null} />}
      </Box>
    </Box>
  );
}
