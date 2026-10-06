import { forwardRef } from "react";
import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import ChatBubbleRounded from "@mui/icons-material/ChatBubbleRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import { ProviderAvatar } from "./ProviderAvatar";
import { RatingLabel } from "./RatingLabel";
import { firstName, formatDistance, shortArea, telHref, travelHint } from "../lib/format";
import { tokens } from "../theme";

// A provider as customers see it. Used in search results and, with `preview`,
// on the sign-up form and dashboard so providers see exactly what customers see.
export const ProviderCard = forwardRef(function ProviderCard(
  { provider, selected = false, onSelect, onHover, onMessage, preview = false, distanceLabel },
  ref,
) {
  const {
    serviceRendererName: name,
    services,
    bio,
    distance,
    online,
    rating,
    ratingCount,
    location,
    phoneNumber,
  } = provider;
  const distanceText = distanceLabel ?? formatDistance(distance);
  const hint = distanceLabel ? "" : travelHint(distance);

  return (
    <Box
      ref={ref}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      sx={{
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1.5,
        borderColor: selected ? tokens.forest : "divider",
        boxShadow: selected ? "0 8px 24px -12px rgba(15,61,46,0.35)" : "none",
        transition: "border-color .15s, box-shadow .15s",
        animation: preview ? "none" : "rise .25s ease-out both",
        "&:hover": onSelect ? { borderColor: selected ? tokens.forest : "#cfc9bc" } : undefined,
      }}
    >
      {/* Only the summary row toggles selection, so the action buttons below aren't nested inside another button */}
      <Box
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        aria-expanded={onSelect ? selected : undefined}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (onSelect && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onSelect();
          }
        }}
        sx={{
          p: 2,
          pb: selected || preview ? 0 : 2,
          borderRadius: 3,
          cursor: onSelect ? "pointer" : "default",
          "&:focus-visible": { outline: `3px solid ${tokens.amber}`, outlineOffset: 2 },
        }}
      >
        <Stack direction="row" sx={{ gap: 1.75, alignItems: "flex-start" }}>
          <ProviderAvatar name={name || "Your name"} online={online} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {name || "Your name"}
              </Typography>
              <RatingLabel rating={rating} count={ratingCount} />
            </Stack>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }} noWrap>
              {services || "Your service"}
              {location?.formattedAddress && ` · ${shortArea(location.formattedAddress)}`}
            </Typography>
            <Stack direction="row" sx={{ mt: 1, gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              {distanceText && (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {distanceText}
                  {hint && (
                    <Typography component="span" variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      {" "}
                      · {hint}
                    </Typography>
                  )}
                </Typography>
              )}
              {online !== undefined && (
                <Typography variant="body2" sx={{ color: online ? "success.main" : "text.secondary", fontWeight: 600 }}>
                  {online ? "Online now" : "Offline"}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Details and actions only appear once a card is chosen (progressive disclosure) */}
      <Collapse in={selected || preview} unmountOnExit={!preview}>
        <Box sx={{ px: 2, pb: 2 }}>
          {bio ? (
            <Typography variant="body2" sx={{ mt: 1.5, color: "text.primary", lineHeight: 1.6 }}>
              {bio}
            </Typography>
          ) : (
            preview && (
              <Typography variant="body2" sx={{ mt: 1.5, color: "text.disabled", fontStyle: "italic" }}>
                A one-line pitch helps customers pick you.
              </Typography>
            )
          )}
          {!preview && (
            <Stack direction="row" sx={{ mt: 2, gap: 1 }}>
              <Button
                fullWidth
                variant={online ? "contained" : "outlined"}
                startIcon={<ChatBubbleRounded />}
                onClick={onMessage}
              >
                Message {firstName(name)}
              </Button>
              <Button
                fullWidth
                variant={online ? "outlined" : "contained"}
                startIcon={<PhoneRounded />}
                href={telHref(phoneNumber)}
              >
                Call
              </Button>
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
});
