import { useCallback, useEffect, useState } from "react";

// Wraps the browser geolocation API with an explicit state machine so the UI
// can ask politely first instead of firing the browser prompt on page load.
// status: idle | prompt | locating | granted | denied | unavailable
export function useGeolocation() {
  const [status, setStatus] = useState(() => ("geolocation" in navigator ? "idle" : "unavailable"));
  const [coords, setCoords] = useState(null);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return setStatus("unavailable");
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        setStatus("granted");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  // If permission was already granted on a previous visit, skip the ask entirely
  useEffect(() => {
    if (!navigator.permissions?.query) return setStatus((s) => (s === "idle" ? "prompt" : s));
    navigator.permissions
      .query({ name: "geolocation" })
      .then((perm) => {
        if (perm.state === "granted") locate();
        else setStatus(perm.state === "denied" ? "denied" : "prompt");
      })
      .catch(() => setStatus("prompt"));
  }, [locate]);

  return { status, coords, locate };
}
