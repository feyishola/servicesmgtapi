import { Box, Button, Stack } from "@mui/material";
import { Link } from "react-router";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";

export function PublicHeader({ children, maxWidth = 1200 }) {
  const { token } = useAuth();
  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "rgba(247,245,240,0.85)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "center", gap: 2, maxWidth, mx: "auto", px: { xs: 2, md: 3 }, height: 64 }}
      >
        <Logo />
        <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        {token ? (
          <Button component={Link} to="/dashboard" variant="contained">
            Dashboard
          </Button>
        ) : (
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            <Button component={Link} to="/join" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
              List your service
            </Button>
            <Button component={Link} to="/login" variant="outlined" color="inherit" sx={{ borderColor: "divider" }}>
              Pro sign in
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
