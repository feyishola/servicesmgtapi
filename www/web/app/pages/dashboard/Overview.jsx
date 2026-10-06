import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import LinkRounded from "@mui/icons-material/LinkRounded";
import { ProviderCard } from "../../components/ProviderCard";
import { RatingLabel } from "../../components/RatingLabel";
import { ServiceInput } from "../../components/ServiceInput";
import { OnlineDot } from "../../components/ProviderAvatar";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useInbox } from "../../context/InboxContext";
import { firstName, shortArea } from "../../lib/format";
import { tokens } from "../../theme";

const BIO_MAX = 160;

function Card({ children, sx }) {
  return (
    <Box sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper", border: 1, borderColor: "divider", ...sx }}>
      {children}
    </Box>
  );
}

function EditProfileDialog({ open, onClose }) {
  const { user, setUser, authedApi } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const values = form || {
    serviceRendererName: user?.serviceRendererName || "",
    services: user?.services || "",
    bio: user?.bio || "",
    permanentAddress: "",
  };
  const set = (key) => (e) => setForm({ ...values, [key]: typeof e === "string" ? e : e.target.value });

  const close = () => {
    setForm(null);
    setError("");
    onClose();
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const body = { ...values };
      if (!body.permanentAddress.trim()) delete body.permanentAddress;
      const updated = await authedApi("/services/me", { method: "PATCH", body });
      setUser({ ...user, ...updated });
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Edit your listing</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2.25, pt: 1 }}>
          <TextField
            label="Name or business name"
            value={values.serviceRendererName}
            onChange={set("serviceRendererName")}
            fullWidth
          />
          <ServiceInput label="Service you offer" value={values.services} onChange={set("services")} />
          <TextField
            label="One-line pitch"
            value={values.bio}
            onChange={(e) => setForm({ ...values, bio: e.target.value.slice(0, BIO_MAX) })}
            helperText={`${values.bio.length}/${BIO_MAX}`}
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="Move to a new area"
            placeholder={shortArea(user?.location?.formattedAddress)}
            value={values.permanentAddress}
            onChange={set("permanentAddress")}
            helperText={`Currently: ${user?.location?.formattedAddress || "not set"}. Leave blank to keep it.`}
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={close} color="inherit">
          Cancel
        </Button>
        <Button onClick={save} variant="contained" loading={saving}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Overview() {
  const { user } = useAuth();
  const { connected } = useSocket();
  const { conversations } = useInbox();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const welcome = params.get("welcome");
  const area = shortArea(user.location?.formattedAddress);
  const listingPath = `/search?service=${encodeURIComponent(user.services)}&address=${encodeURIComponent(area)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + listingPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked; the link is still visible via "See my listing" */
    }
  };

  // A short, finishable checklist: progress that's visibly close to done gets completed
  const checklist = [
    { done: true, label: "Name and service added" },
    { done: Boolean(user.location?.coordinates), label: `Area set to ${area || "your location"}` },
    {
      done: Boolean(user.bio),
      label: "Add a one-line pitch",
      hint: "Pros with a pitch get chosen more often.",
      action: (
        <Button size="small" onClick={() => setEditing(true)}>
          Add pitch
        </Button>
      ),
    },
    { done: connected, label: "Be online to get messages", hint: "Keep this tab open while you're available." },
    {
      done: user.ratingCount > 0,
      label: "Get your first rating",
      hint: "Send your listing to a past customer.",
      action: (
        <Button size="small" startIcon={<LinkRounded />} onClick={copyLink}>
          {copied ? "Link copied" : "Copy link"}
        </Button>
      ),
    },
  ];
  const progress = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {welcome && (
        <Alert
          severity="success"
          icon={false}
          onClose={() => setParams({}, { replace: true })}
          sx={{
            mb: 3,
            borderRadius: 4,
            bgcolor: "#e3f4ea",
            color: tokens.ink,
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.25 }}>
            You're live, {firstName(user.serviceRendererName)} 🎉
          </Typography>
          <Typography variant="body2">
            People searching for {user.services.toLowerCase()} near {area || "you"} can now find you. Here's what to do
            next.
          </Typography>
        </Alert>
      )}

      {/* Status: being visible is what providers care about most, so it leads */}
      <Card
        sx={{
          mb: 3,
          display: "flex",
          gap: 2.5,
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          bgcolor: connected ? tokens.forest : "background.paper",
          color: connected ? "#fff" : "text.primary",
          borderColor: connected ? tokens.forest : "divider",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: connected ? "rgba(255,255,255,0.12)" : "#f1eee8",
            flexShrink: 0,
          }}
        >
          <OnlineDot online={connected} pulse size={16} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">{connected ? "You're online" : "You're offline"}</Typography>
          <Typography sx={{ opacity: connected ? 0.85 : 1, color: connected ? "inherit" : "text.secondary" }}>
            {connected
              ? `Customers looking for ${user.services.toLowerCase()} near ${area || "you"} can message you right now. Close this tab and you'll show as offline. They can still call you.`
              : "We're reconnecting. Customers can still see your listing and call you."}
          </Typography>
        </Box>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        <Card>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
            Rating
          </Typography>
          {user.ratingCount ? (
            <RatingLabel rating={user.rating} count={user.ratingCount} size="large" />
          ) : (
            <>
              <RatingLabel count={0} />
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                Customers can rate you after you reply to them.
              </Typography>
            </>
          )}
        </Card>
        <Card>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
            Conversations this session
          </Typography>
          <Stack direction="row" sx={{ alignItems: "baseline", gap: 1.5 }}>
            <Typography variant="h4">{conversations.length}</Typography>
            <Button component={Link} to="/dashboard/inbox" size="small">
              Open inbox
            </Button>
          </Stack>
        </Card>
        <Card>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
            Listing strength
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#efece5",
              "& .MuiLinearProgress-bar": { bgcolor: tokens.online, borderRadius: 4 },
            }}
          />
        </Card>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: 3, alignItems: "start" }}>
        <Card>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {progress === 100 ? "Your listing is in great shape" : "Get chosen more often"}
          </Typography>
          <Stack sx={{ gap: 0.5 }}>
            {checklist.map((item) => (
              <Stack
                key={item.label}
                direction="row"
                sx={{
                  gap: 1.5,
                  alignItems: "flex-start",
                  py: 1.25,
                  borderBottom: 1,
                  borderColor: "divider",
                  "&:last-of-type": { borderBottom: 0 },
                }}
              >
                {item.done ? (
                  <CheckCircleRounded sx={{ color: tokens.online, mt: 0.25 }} />
                ) : (
                  <RadioButtonUncheckedRounded sx={{ color: "#c9c3b7", mt: 0.25 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: item.done ? "text.secondary" : "text.primary",
                      textDecoration: item.done ? "line-through" : "none",
                      textDecorationColor: "#c9c3b7",
                    }}
                  >
                    {item.label}
                  </Typography>
                  {!item.done && item.hint && (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {item.hint}
                    </Typography>
                  )}
                </Box>
                {!item.done && item.action}
              </Stack>
            ))}
          </Stack>
        </Card>

        <Box>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="h6">How customers see you</Typography>
            <Button startIcon={<EditRounded />} onClick={() => setEditing(true)}>
              Edit
            </Button>
          </Stack>
          <ProviderCard provider={{ ...user, online: connected }} preview distanceLabel="Nearby" />
          <Button component={Link} to={listingPath} fullWidth sx={{ mt: 1.5 }}>
            See your listing in search
          </Button>
        </Box>
      </Box>

      <EditProfileDialog open={editing} onClose={() => setEditing(false)} />
    </Container>
  );
}
