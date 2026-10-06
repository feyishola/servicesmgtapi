import { Box, Chip, Typography } from "@mui/material";
import StarRounded from "@mui/icons-material/StarRounded";
import { tokens } from "../theme";

// New providers get a "New" tag rather than a discouraging 0.0 stars
export function RatingLabel({ rating, count, size = "small" }) {
  if (!count) {
    return <Chip label="New" size="small" sx={{ height: 22, bgcolor: "#fdf3d7", color: "#7a5a00", fontSize: 12 }} />;
  }
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}>
      <StarRounded sx={{ fontSize: size === "large" ? 22 : 18, color: "#e3a008" }} />
      <Typography component="span" sx={{ fontWeight: 700, fontSize: size === "large" ? 18 : 14 }}>
        {Number(rating).toFixed(1)}
      </Typography>
      <Typography component="span" sx={{ fontSize: size === "large" ? 14 : 13, color: tokens.muted }}>
        ({count})
      </Typography>
    </Box>
  );
}
