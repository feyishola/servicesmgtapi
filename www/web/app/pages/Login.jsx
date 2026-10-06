import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { Alert, Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { AuthShell } from "../components/AuthShell";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const DEMO = { phoneNumber: "08000000001", password: "demo1234" };

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { token, signIn } = useAuth();
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(params.get("expired") ? "Your session expired. Please sign in again." : "");
  const next = params.get("next") || "/dashboard";

  if (token) return <Navigate to={next} replace />;

  const submit = async (credentials = form) => {
    setSubmitting(true);
    setError("");
    try {
      const { user, token: newToken } = await api("/services/login", { method: "POST", body: credentials });
      signIn(newToken, user);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <AuthShell maxWidth="sm">
      <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 36 }, mb: 1 }}>
        Welcome back
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>Sign in to go online and answer customers nearby.</Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Stack sx={{ gap: 2.25 }}>
          <TextField
            label="Phone number"
            type="tel"
            autoComplete="tel"
            autoFocus
            value={form.phoneNumber}
            onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
            fullWidth
          />
          <PasswordField
            label="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={submitting}
            disabled={!form.phoneNumber || !form.password}
            fullWidth
          >
            Sign in
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3, color: "text.secondary", fontSize: 13 }}>or</Divider>

      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={() => {
          setForm(DEMO);
          submit(DEMO);
        }}
        sx={{ borderColor: "divider" }}
      >
        Explore with a demo account
      </Button>

      <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mt: 3 }}>
        New here?{" "}
        <Box component={Link} to="/join" sx={{ color: "primary.main", fontWeight: 700 }}>
          List your service free
        </Box>
      </Typography>
    </AuthShell>
  );
}
