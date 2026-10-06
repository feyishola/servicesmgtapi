import { Box, Container, Stack } from "@mui/material";
import { Logo } from "./Logo";

export function AuthShell({ children, aside, maxWidth = "lg" }) {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" sx={{ px: { xs: 2, md: 3 }, height: 64, alignItems: "center" }}>
        <Logo />
      </Stack>
      <Container
        maxWidth={maxWidth}
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: aside ? "1fr 1fr" : "1fr" },
          gap: { xs: 4, md: 8 },
          alignItems: "start",
          py: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 480, mx: aside ? 0 : "auto", justifySelf: aside ? { md: "end" } : "center" }}
        >
          {children}
        </Box>
        {aside && <Box sx={{ position: { md: "sticky" }, top: { md: 96 }, maxWidth: 440 }}>{aside}</Box>}
      </Container>
    </Box>
  );
}
