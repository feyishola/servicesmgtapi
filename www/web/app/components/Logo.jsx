import { Box, Typography } from "@mui/material";
import { Link } from "react-router";
import { BRAND } from "../lib/format";
import { tokens } from "../theme";

export function LogoMark({ size = 30 }) {
  return (
    <Box component="svg" viewBox="0 0 32 32" sx={{ width: size, height: size, flexShrink: 0 }} aria-hidden>
      <rect width="32" height="32" rx="9" fill={tokens.forest} />
      <path d="M16 7c-3.9 0-7 3-7 6.9 0 5 7 11.1 7 11.1s7-6.1 7-11.1C23 10 19.9 7 16 7z" fill={tokens.amber} />
      <circle cx="16" cy="14" r="2.6" fill={tokens.forest} />
    </Box>
  );
}

export function Logo({ to = "/", suffix }) {
  return (
    <Box
      component={Link}
      to={to}
      sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "inherit", textDecoration: "none" }}
    >
      <LogoMark />
      <Typography sx={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em" }}>{BRAND}</Typography>
      {suffix && (
        <Typography component="span" sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", mt: "3px" }}>
          {suffix}
        </Typography>
      )}
    </Box>
  );
}
