import { createTheme, alpha } from "@mui/material/styles";

const ink = "#1c1b18";
const forest = "#0f3d2e";
const amber = "#f5c451";
const paper = "#ffffff";
const sand = "#f7f5f0";
const line = "#e7e3da";

export const tokens = { ink, forest, amber, paper, sand, line, online: "#1f9d55", muted: "#6b675f" };

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: forest, contrastText: "#fff" },
    secondary: { main: amber, contrastText: ink },
    success: { main: tokens.online },
    background: { default: sand, paper },
    text: { primary: ink, secondary: tokens.muted },
    divider: line,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05 },
    h2: { fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 18 },
        sizeLarge: { paddingBlock: 12, paddingInline: 24, fontSize: "1rem" },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 999 } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none" }, outlined: { borderColor: line } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: paper,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: line },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { backgroundColor: ink, fontSize: 12, borderRadius: 8 } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: sand },
        "::selection": { backgroundColor: alpha(amber, 0.5) },
        "@keyframes pulse": {
          "0%": { boxShadow: `0 0 0 0 ${alpha(tokens.online, 0.55)}` },
          "70%": { boxShadow: `0 0 0 10px ${alpha(tokens.online, 0)}` },
          "100%": { boxShadow: `0 0 0 0 ${alpha(tokens.online, 0)}` },
        },
        "@keyframes rise": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "none" },
        },
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": { animationDuration: "0.01ms !important", transitionDuration: "0.01ms !important" },
        },
      },
    },
  },
});
