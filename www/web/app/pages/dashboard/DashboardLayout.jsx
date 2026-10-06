import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import { Logo } from "../../components/Logo";
import { OnlineDot } from "../../components/ProviderAvatar";
import { useAuth } from "../../context/AuthContext";
import { useSocket, useSocketEvent } from "../../context/SocketContext";
import { InboxProvider, useInbox } from "../../context/InboxContext";
import { avatarColor, initials, shortArea } from "../../lib/format";
import { tokens } from "../../theme";

function PresencePill() {
  const { connected } = useSocket();
  return (
    <Tooltip title={connected ? "Customers nearby can message you while this tab is open" : "Trying to reconnect…"}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          bgcolor: connected ? "#e3f4ea" : "#f1eee8",
        }}
      >
        <OnlineDot online={connected} pulse={connected} size={9} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: connected ? "#17663a" : "text.secondary" }}>
          {connected ? "Online" : "Reconnecting"}
        </Typography>
      </Stack>
    </Tooltip>
  );
}

// Toasts for things that happen while the provider is looking elsewhere
function LiveToasts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { latest, setActiveId } = useInbox();
  const { setUser, user } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (latest && location.pathname !== "/dashboard/inbox") {
      setToast({ kind: "message", ...latest });
    }
  }, [latest]); // eslint-disable-line react-hooks/exhaustive-deps

  useSocketEvent(
    "rating:updated",
    useCallback(
      (r) => {
        setUser({ ...user, rating: r.rating, ratingCount: r.ratingCount });
        setToast({ kind: "rating", ...r });
      },
      [setUser, user],
    ),
  );

  return (
    <Snackbar
      open={Boolean(toast)}
      onClose={(_, reason) => reason !== "clickaway" && setToast(null)}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      message={
        toast?.kind === "rating" ? (
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <StarRounded sx={{ color: tokens.amber }} />
            <span>
              New {toast.score}-star rating. You're now at {Number(toast.rating).toFixed(1)}.
            </span>
          </Stack>
        ) : (
          toast && (
            <span>
              <b>{toast.name}</b>: {toast.body.length > 60 ? `${toast.body.slice(0, 60)}…` : toast.body}
            </span>
          )
        )
      }
      action={
        toast?.kind === "message" && (
          <Button
            color="secondary"
            size="small"
            onClick={() => {
              setActiveId(toast.conversationId);
              navigate("/dashboard/inbox");
              setToast(null);
            }}
          >
            Reply
          </Button>
        )
      }
    />
  );
}

function Shell() {
  const { user, signOut } = useAuth();
  const { totalUnread } = useInbox();
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const tab = location.pathname.startsWith("/dashboard/inbox") ? "inbox" : "overview";
  const name = user?.serviceRendererName || "";

  const listingUrl = user
    ? `/search?service=${encodeURIComponent(user.services)}&address=${encodeURIComponent(shortArea(user.location?.formattedAddress) || "")}`
    : "/search";

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", gap: 2, maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, height: 64 }}
        >
          <Logo to="/dashboard" suffix="for pros" />
          <Tabs
            value={tab}
            sx={{
              ml: { md: 3 },
              flex: 1,
              minHeight: 64,
              "& .MuiTab-root": { minHeight: 64, fontWeight: 700, textTransform: "none", fontSize: 15 },
            }}
          >
            <Tab value="overview" label="Overview" component={NavLink} to="/dashboard" />
            <Tab
              value="inbox"
              component={NavLink}
              to="/dashboard/inbox"
              label={
                <Badge
                  badgeContent={totalUnread}
                  color="secondary"
                  sx={{ "& .MuiBadge-badge": { right: -12, fontWeight: 800 } }}
                >
                  Inbox
                </Badge>
              }
            />
          </Tabs>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <PresencePill />
          </Box>
          <IconButton onClick={(e) => setMenu(e.currentTarget)} aria-label="Account menu">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: avatarColor(name),
                color: tokens.ink,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {initials(name)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={menu}
            open={Boolean(menu)}
            onClose={() => setMenu(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user?.phoneNumber}
              </Typography>
            </Box>
            <Divider />
            <MenuItem component={Link} to={listingUrl} onClick={() => setMenu(null)}>
              <ListItemIcon>
                <VisibilityRounded fontSize="small" />
              </ListItemIcon>
              See my listing as a customer
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              <ListItemIcon>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </Box>
      <LiveToasts />
    </Box>
  );
}

export function DashboardLayout() {
  return (
    <InboxProvider>
      <Shell />
    </InboxProvider>
  );
}
