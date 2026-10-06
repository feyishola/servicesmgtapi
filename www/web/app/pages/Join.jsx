import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { AuthShell } from "../components/AuthShell";
import { ProviderCard } from "../components/ProviderCard";
import { ServiceInput } from "../components/ServiceInput";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { tokens } from "../theme";

const BIO_MAX = 160;

const validators = {
  serviceRendererName: (v) => (v.trim().length < 2 ? "Add the name customers will know you by" : ""),
  phoneNumber: (v) => (v.replace(/\D/g, "").length < 7 ? "Enter a phone number customers can call" : ""),
  services: (v) => (!v.trim() ? "What service do you offer?" : ""),
  permanentAddress: (v) => (v.trim().length < 3 ? "Add your area so nearby customers can find you" : ""),
  password: (v) => (v.length < 6 ? "Use at least 6 characters" : ""),
};

export function JoinPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    serviceRendererName: "",
    phoneNumber: "",
    services: "",
    bio: "",
    permanentAddress: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: typeof e === "string" ? e : e.target.value }));
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));
  // Only complain about a field after the person has left it
  const fieldError = (key) => (touched[key] ? validators[key]?.(form[key]) : "");

  const submit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(validators).map((k) => [k, true]));
    setTouched(allTouched);
    if (Object.keys(validators).some((k) => validators[k](form[k]))) return;

    setSubmitting(true);
    setError("");
    try {
      const { user, token } = await api("/services", { method: "POST", body: form });
      signIn(token, user);
      navigate("/dashboard?welcome=1", { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const preview = {
    serviceRendererName: form.serviceRendererName,
    services: form.services,
    bio: form.bio,
    online: true,
    ratingCount: 0,
    location: form.permanentAddress ? { formattedAddress: form.permanentAddress } : undefined,
  };

  const aside = (
    <Box>
      <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: 1.2 }}>
        Live preview
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        This is how customers nearby will see you
      </Typography>
      <ProviderCard provider={preview} preview distanceLabel="0.8 km away" />
      <Stack sx={{ mt: 3, gap: 1.25 }}>
        {[
          "Free to list. No commission on jobs.",
          "Customers message you only while you're online.",
          "Your exact address is never shown, just your area.",
        ].map((t) => (
          <Stack key={t} direction="row" sx={{ gap: 1, alignItems: "center" }}>
            <CheckCircleRounded sx={{ fontSize: 18, color: tokens.online }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );

  return (
    <AuthShell aside={aside}>
      <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 36 }, mb: 1 }}>
        Get found by customers nearby
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Takes about two minutes. You can edit everything later.
      </Typography>

      <Box component="form" noValidate onSubmit={submit}>
        <Stack sx={{ gap: 2.25 }}>
          <TextField
            label="Your name or business name"
            value={form.serviceRendererName}
            onChange={set("serviceRendererName")}
            onBlur={blur("serviceRendererName")}
            error={Boolean(fieldError("serviceRendererName"))}
            helperText={fieldError("serviceRendererName")}
            autoComplete="name"
            autoFocus
            fullWidth
          />
          <ServiceInput
            value={form.services}
            onChange={set("services")}
            onBlur={blur("services")}
            label="Service you offer"
            placeholder="e.g. Plumbing"
            error={Boolean(fieldError("services"))}
            helperText={fieldError("services")}
          />
          <TextField
            label="One-line pitch (optional)"
            placeholder="Same-day call-outs for leaks and blocked drains."
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value.slice(0, BIO_MAX) }))}
            helperText={`${form.bio.length}/${BIO_MAX}. Pros with a pitch get chosen more often.`}
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="Your area"
            placeholder="e.g. Wuse II, Abuja"
            value={form.permanentAddress}
            onChange={set("permanentAddress")}
            onBlur={blur("permanentAddress")}
            error={Boolean(fieldError("permanentAddress"))}
            helperText={fieldError("permanentAddress") || "Customers see the area, not your street address."}
            autoComplete="address-level2"
            fullWidth
          />
          <TextField
            label="Phone number"
            type="tel"
            value={form.phoneNumber}
            onChange={set("phoneNumber")}
            onBlur={blur("phoneNumber")}
            error={Boolean(fieldError("phoneNumber"))}
            helperText={fieldError("phoneNumber") || "Customers can call you, and you'll sign in with it."}
            autoComplete="tel"
            fullWidth
          />
          <PasswordField
            label="Create a password"
            value={form.password}
            onChange={set("password")}
            onBlur={blur("password")}
            error={Boolean(fieldError("password"))}
            helperText={fieldError("password") || "At least 6 characters."}
            autoComplete="new-password"
            fullWidth
          />

          {error && (
            <Alert
              severity="error"
              action={
                error.includes("already registered") ? (
                  <Button component={Link} to="/login" color="inherit">
                    Sign in
                  </Button>
                ) : null
              }
            >
              {error}
            </Alert>
          )}

          <Button type="submit" variant="contained" size="large" loading={submitting} fullWidth>
            Go live
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            Already listed?{" "}
            <Box component={Link} to="/login" sx={{ color: "primary.main", fontWeight: 700 }}>
              Sign in
            </Box>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
