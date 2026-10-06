import { Link } from "react-router";
import { Box, Button, Stack, Typography } from "@mui/material";
import { PublicHeader } from "../components/PublicHeader";

export function NotFound() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <PublicHeader />
      <Box sx={{ flex: 1, display: "grid", placeItems: "center", p: 3, textAlign: "center" }}>
        <Box>
          <Typography sx={{ fontSize: 64, mb: 1 }}>🧭</Typography>
          <Typography variant="h3" sx={{ mb: 1 }}>
            This page wandered off
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 4 }}>The link may be old, or the page has moved.</Typography>
          <Stack direction="row" sx={{ gap: 1.5, justifyContent: "center" }}>
            <Button component={Link} to="/search" variant="contained" size="large">
              Find a pro nearby
            </Button>
            <Button component={Link} to="/" size="large">
              Go home
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
