import { Avatar, Badge } from "@mui/material";
import { avatarColor, initials } from "../lib/format";
import { tokens } from "../theme";

export function OnlineDot({ online, size = 10, pulse = false, sx }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        backgroundColor: online ? tokens.online : "#b9b4aa",
        animation: online && pulse ? "pulse 2s infinite" : "none",
        ...sx,
      }}
    />
  );
}

export function ProviderAvatar({ name, online, size = 48 }) {
  const avatar = (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: avatarColor(name),
        color: tokens.ink,
        fontWeight: 700,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </Avatar>
  );
  if (online === undefined) return avatar;
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={<OnlineDot online={online} size={Math.max(10, size * 0.26)} sx={{ border: "2px solid #fff" }} />}
    >
      {avatar}
    </Badge>
  );
}
