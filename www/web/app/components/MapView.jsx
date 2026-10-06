import { useEffect, useMemo, useRef } from "react";
import Map, { Layer, Marker, NavigationControl, Source } from "react-map-gl/maplibre";
import { setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@mui/material";
import { circleBounds, circlePolygon, DEFAULT_CENTER } from "../lib/geo";
import { initials } from "../lib/format";
import { tokens } from "../theme";

// MapLibre finds its worker relative to its own file, which bundling breaks.
// Let Vite bundle the worker and tell MapLibre where it ended up.
setWorkerUrl(maplibreWorkerUrl);

// Free, keyless vector tiles (https://openfreemap.org)
const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

const radiusFill = { id: "radius-fill", type: "fill", paint: { "fill-color": tokens.amber, "fill-opacity": 0.1 } };
const radiusLine = {
  id: "radius-line",
  type: "line",
  paint: { "line-color": tokens.forest, "line-width": 1.5, "line-dasharray": [2, 2], "line-opacity": 0.6 },
};

function Pin({ provider, active, onClick }) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={`${provider.serviceRendererName}, ${provider.services}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      sx={{
        all: "unset",
        cursor: "pointer",
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: 34,
        height: 34,
        borderRadius: "50%",
        fontSize: 12,
        fontWeight: 800,
        fontFamily: "inherit",
        color: active ? "#fff" : tokens.ink,
        bgcolor: active ? tokens.forest : "#fff",
        border: `2px solid ${active ? tokens.amber : "#fff"}`,
        boxShadow: "0 4px 12px rgba(28,27,24,0.25)",
        transform: active ? "scale(1.25)" : "scale(1)",
        transition: "transform .15s, background-color .15s",
        zIndex: active ? 2 : 1,
        "&:hover": { transform: "scale(1.15)" },
        "&:focus-visible": { outline: `3px solid ${tokens.amber}`, outlineOffset: 2 },
      }}
    >
      {initials(provider.serviceRendererName)}
      {provider.online && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 11,
            height: 11,
            borderRadius: "50%",
            bgcolor: tokens.online,
            border: "2px solid #fff",
          }}
        />
      )}
    </Box>
  );
}

function YouAreHere() {
  return (
    <Box
      aria-label="Search centre"
      sx={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        bgcolor: "#2f6fed",
        border: "3px solid #fff",
        boxShadow: "0 0 0 8px rgba(47,111,237,0.18), 0 2px 6px rgba(0,0,0,0.25)",
      }}
    />
  );
}

// `visible` lets the parent signal the map was just shown (it's display:none on
// mobile's list view), so it can resize and re-frame the search area.
export function MapView({ center, meters, results, activeId, onSelect, visible = true }) {
  const mapRef = useRef(null);
  const circle = useMemo(() => (center ? circlePolygon(center.lng, center.lat, meters) : null), [center, meters]);

  // Frame the whole search radius so the circle itself explains the results
  useEffect(() => {
    const map = mapRef.current;
    if (!center || !map || !visible) return;
    const frame = requestAnimationFrame(() => {
      map.resize();
      map.fitBounds(circleBounds(center.lng, center.lat, meters), { padding: 32, duration: 700 });
    });
    return () => cancelAnimationFrame(frame);
  }, [center, meters, visible]);

  // Bring a provider chosen from the list into view if it's off-screen
  useEffect(() => {
    const map = mapRef.current;
    const provider = results.find((p) => p._id === activeId);
    if (!map || !provider) return;
    const [lng, lat] = provider.location.coordinates;
    if (!map.getBounds().contains([lng, lat])) map.easeTo({ center: [lng, lat], duration: 500 });
  }, [activeId, results]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: (center || DEFAULT_CENTER).lng,
        latitude: (center || DEFAULT_CENTER).lat,
        zoom: 11,
      }}
      mapStyle={MAP_STYLE}
      style={{ width: "100%", height: "100%" }}
      onClick={() => onSelect(null)}
      onLoad={() => {
        if (center)
          mapRef.current?.fitBounds(circleBounds(center.lng, center.lat, meters), { padding: 32, duration: 0 });
      }}
      attributionControl={{ compact: true }}
    >
      <NavigationControl position="bottom-right" showCompass={false} />
      {circle && (
        <Source id="radius" type="geojson" data={circle}>
          <Layer {...radiusFill} />
          <Layer {...radiusLine} />
        </Source>
      )}
      {center && (
        <Marker longitude={center.lng} latitude={center.lat}>
          <YouAreHere />
        </Marker>
      )}
      {results.map((p) => (
        <Marker
          key={p._id}
          longitude={p.location.coordinates[0]}
          latitude={p.location.coordinates[1]}
          style={{ zIndex: p._id === activeId ? 2 : 1 }}
        >
          <Pin provider={p} active={p._id === activeId} onClick={() => onSelect(p._id)} />
        </Marker>
      ))}
    </Map>
  );
}
