export const BRAND = "Nearby";

// Radius presets described the way people think about distance, not in meters
export const RADII = [
  { meters: 1000, label: "Walking distance", short: "1 km" },
  { meters: 5000, label: "Nearby", short: "5 km" },
  { meters: 15000, label: "Across town", short: "15 km" },
  { meters: 50000, label: "Whole city", short: "50 km" },
];
export const DEFAULT_RADIUS = 5000;

export const radiusFor = (meters) => RADII.find((r) => r.meters === meters) || RADII[1];

// Smallest preset that covers `meters`, used for the one-tap "widen search"
export const radiusCovering = (meters) => RADII.find((r) => r.meters >= meters) || RADII.at(-1);

export function formatDistance(meters) {
  if (meters == null) return "";
  if (meters < 50) return "Right here";
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m away`;
  const km = meters / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`;
}

// Rough, honest travel hint: walking under 1.5 km, city driving beyond
export function travelHint(meters) {
  if (meters == null || meters < 50) return "";
  if (meters < 1500) return `~${Math.max(1, Math.round(meters / 80))} min walk`;
  return `~${Math.max(2, Math.round(meters / 400))} min drive`;
}

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const AVATAR_COLORS = ["#d9e8df", "#f6e3b4", "#e4dcf3", "#f5d6cc", "#d4e4f2", "#e9e1d3", "#d8efe8"];
export function avatarColor(seed = "") {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export const firstName = (name = "") => name.split(/\s+/)[0] || name;

// "Wuse II, Abuja, Nigeria" -> "Wuse II"
export const shortArea = (address = "") => address.split(",")[0]?.trim() || "";

export function timeAgo(at) {
  const seconds = Math.round((Date.now() - at) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return new Date(at).toLocaleDateString();
}

export const clockTime = (at) => new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const telHref = (phone = "") => `tel:${phone.replace(/[^\d+]/g, "")}`;
