import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import NearMeRounded from "@mui/icons-material/NearMeRounded";
import ChatBubbleRounded from "@mui/icons-material/ChatBubbleRounded";
import { PublicHeader } from "../components/PublicHeader";
import { ServiceInput, usePopularServices } from "../components/ServiceInput";
import { OnlineDot } from "../components/ProviderAvatar";
import { LogoMark } from "../components/Logo";
import { BRAND } from "../lib/format";
import { tokens } from "../theme";

const steps = [
  {
    icon: <SearchRounded />,
    title: "Say what you need",
    body: "Type it the way you'd say it. “Leaking tap”, “braids”, “AC repair”.",
  },
  {
    icon: <NearMeRounded />,
    title: "See who's close, and who's online",
    body: "Pros are ranked by distance, with a live dot for anyone who can reply right now.",
  },
  {
    icon: <ChatBubbleRounded />,
    title: "Message or call. No sign-up.",
    body: "Ask your question in seconds. We only ask pros to create an account, never you.",
  },
];

const principles = [
  {
    title: "Online now, not just listed",
    body: "A green dot means a real person is there right now. Offline pros show a call button instead of a chat box that would go nowhere.",
  },
  {
    title: "Distance you can feel",
    body: "“Walking distance” and “~6 min drive” instead of “4,800 m”. People think in trips, not meters.",
  },
  {
    title: "No dead ends",
    body: "Nothing nearby? We tell you how far the closest pro is and widen the search in one tap.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const popular = usePopularServices();
  const [service, setService] = useState("");

  const go = (value = service) => {
    const term = value.trim();
    navigate(term ? `/search?service=${encodeURIComponent(term)}` : "/search");
  };

  return (
    <Box>
      <PublicHeader />

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: `radial-gradient(circle at 1px 1px, ${tokens.line} 1.2px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 0%, transparent 0%, ${tokens.sand} 70%)`,
          }}
        />
        <Container
          maxWidth="md"
          sx={{ position: "relative", textAlign: "center", pt: { xs: 8, md: 14 }, pb: { xs: 8, md: 12 } }}
        >
          <Chip
            icon={<OnlineDot online pulse size={8} sx={{ marginLeft: 10 }} />}
            label="No sign-up needed to search"
            sx={{ mb: 3, bgcolor: "background.paper", border: 1, borderColor: "divider" }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 60, md: 76 }, mb: 2.5 }}>
            Get it sorted by someone{" "}
            <Box component="span" sx={{ position: "relative", whiteSpace: "nowrap" }}>
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  bottom: "0.08em",
                  height: "0.32em",
                  bgcolor: tokens.amber,
                  borderRadius: 1,
                  zIndex: -1,
                  opacity: 0.85,
                }}
              />
              nearby.
            </Box>
          </Typography>
          <Typography sx={{ fontSize: { xs: 17, md: 20 }, color: "text.secondary", maxWidth: 580, mx: "auto", mb: 5 }}>
            Find plumbers, electricians, stylists and more around you. See who's online and message them in seconds.
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.25,
              p: 1.25,
              maxWidth: 620,
              mx: "auto",
              bgcolor: "background.paper",
              borderRadius: 5,
              border: 1,
              borderColor: "divider",
              boxShadow: "0 24px 48px -24px rgba(28,27,24,0.25)",
            }}
          >
            <ServiceInput
              value={service}
              onChange={setService}
              onSubmit={go}
              autoFocus
              sx={{ flex: 1 }}
              label=""
              placeholder="What do you need help with?"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              sx={{ minHeight: 56, px: 3.5 }}
            >
              Find pros
            </Button>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1.5 }}>
            We'll ask for your location on the next screen, or you can type an address.
          </Typography>

          {popular.length > 0 && (
            <Stack
              direction="row"
              sx={{ mt: 4, gap: 1, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary", mr: 0.5 }}>
                Popular:
              </Typography>
              {popular.slice(0, 6).map((p) => (
                <Chip
                  key={p.label}
                  label={p.label}
                  onClick={() => go(p.label)}
                  variant="outlined"
                  sx={{ bgcolor: "background.paper" }}
                />
              ))}
            </Stack>
          )}
        </Container>
      </Box>

      {/* How it works */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 1.5 }}>
          How it works
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 6, maxWidth: 560 }}>
          From “I need someone” to talking to them, in under a minute.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {steps.map((s, i) => (
            <Box
              key={s.title}
              sx={{ p: 3.5, borderRadius: 4, bgcolor: "background.paper", border: 1, borderColor: "divider" }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#e6f0ea",
                    color: tokens.forest,
                  }}
                >
                  {s.icon}
                </Box>
                <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>0{i + 1}</Typography>
              </Stack>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {s.title}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>{s.body}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Product principles */}
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 8, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 4, md: 6 },
          }}
        >
          {principles.map((p) => (
            <Box key={p.title}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {p.title}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>{p.body}</Typography>
            </Box>
          ))}
        </Container>
      </Box>

      {/* For pros */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            p: { xs: 4, md: 7 },
            borderRadius: 6,
            bgcolor: tokens.forest,
            color: "#fff",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 42 }, mb: 1.5 }}>
              Do great work? Get found by people around the corner.
            </Typography>
            <Typography sx={{ opacity: 0.8, fontSize: 18 }}>
              List your service free in about two minutes. Customers nearby can message you the moment you're online.
            </Typography>
          </Box>
          <Stack sx={{ gap: 1.5, alignItems: { xs: "stretch", md: "flex-end" } }}>
            <Button
              component={Link}
              to="/join"
              size="large"
              variant="contained"
              color="secondary"
              endIcon={<ArrowForwardRounded />}
            >
              List your service, free
            </Button>
            <Button component={Link} to="/login" sx={{ color: "#fff", opacity: 0.85 }}>
              Already listed? Sign in
            </Button>
          </Stack>
        </Box>
      </Container>

      <Box component="footer" sx={{ borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{ py: 4, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <LogoMark size={24} />
          <Typography variant="body2" sx={{ color: "text.secondary", flex: 1 }}>
            © {new Date().getFullYear()} {BRAND}. Map data © OpenStreetMap contributors.
          </Typography>
          <Typography variant="body2" component={Link} to="/join" sx={{ color: "text.secondary" }}>
            For pros
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
