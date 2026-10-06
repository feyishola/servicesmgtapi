import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Fab,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MyLocationRounded from "@mui/icons-material/MyLocationRounded";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import MapRounded from "@mui/icons-material/MapRounded";
import ViewListRounded from "@mui/icons-material/ViewListRounded";
import NearMeRounded from "@mui/icons-material/NearMeRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { PublicHeader } from "../components/PublicHeader";
import { ServiceInput, usePopularServices } from "../components/ServiceInput";
import { ProviderCard } from "../components/ProviderCard";
import { MapView } from "../components/MapView";
import { ChatDrawer, useCustomerChats } from "../components/ChatDrawer";
import { OnlineDot } from "../components/ProviderAvatar";
import { useSocketEvent } from "../context/SocketContext";
import { useGeolocation } from "../lib/useGeolocation";
import { api } from "../lib/api";
import { DEFAULT_RADIUS, RADII, formatDistance, radiusCovering, radiusFor, shortArea } from "../lib/format";
import { tokens } from "../theme";

const CURRENT_LOCATION = "Current location";

function SoftLocationAsk({ status, onAllow, onTypeInstead }) {
  const denied = status === "denied" || status === "unavailable";
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        textAlign: "center",
        animation: "rise .25s ease-out both",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          mx: "auto",
          mb: 2,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "#e6f0ea",
          color: tokens.forest,
        }}
      >
        <NearMeRounded />
      </Box>
      <Typography variant="h6" sx={{ mb: 0.75 }}>
        {denied ? "Location is turned off" : "See the pros closest to you"}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5, maxWidth: 320, mx: "auto" }}>
        {denied
          ? "No problem. Type an area, street or landmark and we'll search around it."
          : "We use your location for this search only. It's never saved or shared with providers."}
      </Typography>
      <Stack sx={{ gap: 1, alignItems: "center" }}>
        {!denied && (
          <Button
            variant="contained"
            size="large"
            startIcon={<MyLocationRounded />}
            onClick={onAllow}
            loading={status === "locating"}
          >
            Use my location
          </Button>
        )}
        <Button onClick={onTypeInstead} variant={denied ? "contained" : "text"} size={denied ? "large" : "medium"}>
          Type an address instead
        </Button>
      </Stack>
    </Box>
  );
}

function ResultSkeletons() {
  return Array.from({ length: 4 }, (_, i) => (
    <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: "background.paper", border: 1, borderColor: "divider" }}>
      <Stack direction="row" sx={{ gap: 1.75 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="55%" height={24} />
          <Skeleton width="35%" />
          <Skeleton width="45%" />
        </Box>
      </Stack>
    </Box>
  ));
}

function EmptyState({ icon, title, body, children }) {
  return (
    <Box sx={{ py: 5, px: 3, textAlign: "center", animation: "rise .25s ease-out both" }}>
      {icon && <Box sx={{ fontSize: 36, mb: 1 }}>{icon}</Box>}
      <Typography variant="h6" sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      {body && (
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5, maxWidth: 340, mx: "auto" }}>
          {body}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export function SearchPage() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const [params, setParams] = useSearchParams();
  const service = params.get("service") || "";
  const address = params.get("address") || "";
  const nearMe = !address;
  const meters = Number(params.get("radius")) || DEFAULT_RADIUS;

  const geo = useGeolocation();
  const popular = usePopularServices();
  const chats = useCustomerChats();

  const [serviceDraft, setServiceDraft] = useState(service);
  const [addressDraft, setAddressDraft] = useState(address || CURRENT_LOCATION);
  const [state, setState] = useState({ status: "idle", results: [], center: null, nearest: null, error: "" });
  const [activeId, setActiveId] = useState(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [view, setView] = useState("list");
  const [retryKey, setRetryKey] = useState(0);
  const addressRef = useRef(null);
  const cardRefs = useRef({});
  const radiusChipRef = useRef(null);

  useEffect(() => setServiceDraft(service), [service]);
  useEffect(() => setAddressDraft(address || CURRENT_LOCATION), [address]);

  const update = useCallback(
    (changes) => {
      const next = new URLSearchParams(params);
      Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      setParams(next);
    },
    [params, setParams],
  );

  const submit = (serviceValue = serviceDraft) => {
    const typed = addressDraft.trim();
    const useAddress = typed && typed !== CURRENT_LOCATION;
    update({ service: serviceValue.trim(), address: useAddress ? typed : null });
  };

  // On narrow screens the radius row scrolls; keep the chosen option visible
  useEffect(() => {
    radiusChipRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [meters]);

  const needsLocation = Boolean(service) && nearMe && !geo.coords;

  // Search whenever the query in the URL (or the user's position) changes
  useEffect(() => {
    if (!service || (nearMe && !geo.coords)) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading", error: "" }));
    setActiveId(null);
    api("/services/search", {
      method: "POST",
      signal: controller.signal,
      body: { service, meters, ...(nearMe ? geo.coords : { address }) },
    })
      .then((payload) =>
        setState({
          status: "done",
          results: payload.results,
          center: payload.center,
          nearest: payload.nearest,
          error: "",
        }),
      )
      .catch((err) => {
        if (err.name !== "AbortError") setState((s) => ({ ...s, status: "error", results: [], error: err.message }));
      });
    return () => controller.abort();
  }, [service, address, meters, nearMe, geo.coords, retryKey]);

  // Keep "online now" honest while the page is open
  useSocketEvent(
    "presence:changed",
    useCallback(({ providerId, online }) => {
      setState((s) => ({ ...s, results: s.results.map((p) => (p._id === providerId ? { ...p, online } : p)) }));
    }, []),
  );

  const results = state.results;
  const onlineCount = results.filter((p) => p.online).length;
  const shown = onlineOnly ? results.filter((p) => p.online) : results;
  const chatProvider = results.find((p) => p._id === chatId) || null;

  const select = useCallback((id, fromMap = false) => {
    setActiveId(id);
    if (id && fromMap) cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const openChat = (id) => {
    setChatId(id);
    chats.markRead(id);
  };

  const onRated = (id, { rating, ratingCount }) =>
    setState((s) => ({ ...s, results: s.results.map((p) => (p._id === id ? { ...p, rating, ratingCount } : p)) }));

  const typeAddressInstead = () => {
    setAddressDraft("");
    setTimeout(() => addressRef.current?.focus(), 0);
  };

  const area = state.center?.address ? shortArea(state.center.address) : nearMe ? "you" : shortArea(address);
  const radius = radiusFor(meters);

  const list = (
    <Stack sx={{ gap: 1.5, p: { xs: 2, md: 2.5 }, pb: { xs: 12, md: 3 } }}>
      {!service && (
        <EmptyState title="What do you need help with?" body="Pick a popular service or type your own above.">
          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            {popular.map((p) => (
              <Chip key={p.label} label={p.label} onClick={() => update({ service: p.label })} />
            ))}
          </Stack>
        </EmptyState>
      )}

      {needsLocation && <SoftLocationAsk status={geo.status} onAllow={geo.locate} onTypeInstead={typeAddressInstead} />}

      {state.status === "loading" && <ResultSkeletons />}

      {state.status === "error" && !needsLocation && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" onClick={() => setRetryKey((k) => k + 1)}>
              Try again
            </Button>
          }
        >
          {state.error}
        </Alert>
      )}

      {state.status === "done" && service && !needsLocation && (
        <>
          {results.length > 0 && (
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
                  {results.length} {results.length === 1 ? "pro" : "pros"}
                </Box>{" "}
                within {radius.short} of {area}
              </Typography>
              {onlineCount > 0 && (
                <Chip
                  size="small"
                  icon={<OnlineDot online size={8} sx={{ marginLeft: 8 }} />}
                  label={`${onlineCount} online`}
                  onClick={() => setOnlineOnly((v) => !v)}
                  color={onlineOnly ? "primary" : "default"}
                  variant={onlineOnly ? "filled" : "outlined"}
                />
              )}
            </Stack>
          )}

          {shown.map((p) => (
            <Badge
              key={p._id}
              color="secondary"
              badgeContent={chats.threads[p._id]?.unread ? "New reply" : 0}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ display: "block", "& .MuiBadge-badge": { right: 24, fontWeight: 700 } }}
            >
              <ProviderCard
                ref={(el) => (cardRefs.current[p._id] = el)}
                provider={p}
                selected={activeId === p._id}
                onSelect={() => select(activeId === p._id ? null : p._id)}
                onMessage={() => openChat(p._id)}
              />
            </Badge>
          ))}

          {results.length === 0 && state.nearest && (
            <EmptyState
              icon="🧭"
              title={`No “${service}” pros within ${radius.short}`}
              body={`The closest one is ${formatDistance(state.nearest.distance).replace(" away", "")} from ${area}.`}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => update({ radius: radiusCovering(state.nearest.distance).meters })}
              >
                Show pros within {radiusCovering(state.nearest.distance).short}
              </Button>
            </EmptyState>
          )}

          {results.length === 0 && !state.nearest && (
            <EmptyState
              icon="🔎"
              title={`Nobody offers “${service}” here yet`}
              body="Try a broader word, or one of these popular services."
            >
              <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 3 }}>
                {popular.slice(0, 6).map((p) => (
                  <Chip key={p.label} label={p.label} onClick={() => update({ service: p.label })} />
                ))}
              </Stack>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Know someone great at this?{" "}
                <Box component={Link} to="/join" sx={{ color: "primary.main", fontWeight: 700 }}>
                  They can list for free
                </Box>
              </Typography>
            </EmptyState>
          )}

          {onlineOnly && shown.length === 0 && results.length > 0 && (
            <EmptyState
              title="No one's online right now"
              body={`${results.length} offline ${results.length === 1 ? "pro" : "pros"} nearby can still be called.`}
            >
              <Button onClick={() => setOnlineOnly(false)}>Show everyone</Button>
            </EmptyState>
          )}
        </>
      )}
    </Stack>
  );

  const activeProvider = shown.find((p) => p._id === activeId);

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <PublicHeader maxWidth="none" />

      {/* Search controls */}
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper", px: { xs: 2, md: 2.5 }, py: 1.5 }}
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr auto", md: "minmax(220px, 1.1fr) minmax(220px, 1fr) auto" },
            gap: 1.25,
            alignItems: "center",
          }}
        >
          <ServiceInput
            value={serviceDraft}
            onChange={setServiceDraft}
            onSubmit={submit}
            size="small"
            label="Service"
            sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}
          />
          <TextField
            inputRef={addressRef}
            size="small"
            label="Near"
            value={addressDraft}
            placeholder="Area, street or landmark"
            onChange={(e) => setAddressDraft(e.target.value)}
            onFocus={(e) => addressDraft === CURRENT_LOCATION && e.target.select()}
            slotProps={{
              input: {
                sx: {
                  color: addressDraft === CURRENT_LOCATION ? "primary.main" : undefined,
                  fontWeight: addressDraft === CURRENT_LOCATION ? 600 : undefined,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceOutlined sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Use my current location">
                      <IconButton
                        size="small"
                        aria-label="Use my current location"
                        color={nearMe && addressDraft === CURRENT_LOCATION ? "primary" : "default"}
                        onClick={() => {
                          setAddressDraft(CURRENT_LOCATION);
                          update({ address: null });
                          if (!geo.coords) geo.locate();
                        }}
                      >
                        <MyLocationRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ height: 40, minWidth: { xs: 0, md: 64 } }}
            aria-label="Search"
          >
            {mobile ? <SearchRounded /> : "Search"}
          </Button>
        </Box>

        {/* Distance in human terms, applied instantly */}
        <Stack
          direction="row"
          sx={{ mt: 1.25, gap: 1, overflowX: "auto", pb: 0.25, scrollbarWidth: "none" }}
          role="radiogroup"
          aria-label="Search radius"
        >
          {RADII.map((r) => (
            <Chip
              key={r.meters}
              role="radio"
              aria-checked={meters === r.meters}
              label={
                <span>
                  {r.label} <span style={{ opacity: 0.6, fontWeight: 500 }}>· {r.short}</span>
                </span>
              }
              onClick={() => update({ radius: r.meters === DEFAULT_RADIUS ? null : r.meters })}
              ref={meters === r.meters ? radiusChipRef : undefined}
              color={meters === r.meters ? "primary" : "default"}
              variant={meters === r.meters ? "filled" : "outlined"}
              sx={{ flexShrink: 0 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Results + map */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "420px 1fr", lg: "460px 1fr" },
          position: "relative",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            display: mobile && view === "map" ? "none" : "block",
            borderRight: { md: 1 },
            borderColor: { md: "divider" },
          }}
        >
          {list}
        </Box>
        <Box sx={{ position: "relative", display: mobile && view === "list" ? "none" : "block", minHeight: 0 }}>
          <MapView
            center={state.center || geo.coords}
            meters={meters}
            results={shown}
            activeId={activeId}
            onSelect={(id) => select(id, true)}
            visible={!mobile || view === "map"}
          />
          {mobile && activeProvider && (
            <Box sx={{ position: "absolute", left: 12, right: 12, bottom: 84, zIndex: 3 }}>
              <ProviderCard provider={activeProvider} selected onMessage={() => openChat(activeProvider._id)} />
            </Box>
          )}
        </Box>

        {mobile && (
          <Fab
            variant="extended"
            color="primary"
            onClick={() => setView((v) => (v === "list" ? "map" : "list"))}
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 4,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {view === "list" ? <MapRounded sx={{ mr: 1 }} /> : <ViewListRounded sx={{ mr: 1 }} />}
            {view === "list" ? "Map" : "List"}
          </Fab>
        )}
      </Box>

      <ChatDrawer
        provider={chatProvider}
        open={Boolean(chatProvider)}
        onClose={() => setChatId(null)}
        chats={chats}
        onRated={(r) => onRated(chatId, r)}
      />
    </Box>
  );
}
