const clamp = (n) => Math.min(Math.max(Number(n) || 0, 0), 5);

// Average of the five rating categories, each clamped to 0-5.
// A single overall `score` can be sent instead of the categories.
const ratings = ({
  score,
  timeliness,
  communication,
  valueForMoney,
  customerService,
  professionalism,
}) => {
  if (score !== undefined) return clamp(score);
  const parts = [timeliness, communication, valueForMoney, customerService, professionalism];
  return parts.reduce((sum, n) => sum + clamp(n), 0) / parts.length;
};

// Escapes user input before it is used inside a RegExp
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { ratings, escapeRegex };
