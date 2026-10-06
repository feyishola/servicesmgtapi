const EARTH_RADIUS = 6371008.8;
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

// GeoJSON polygon approximating a circle of `meters` around [lng, lat]
export function circlePolygon(lng, lat, meters, steps = 72) {
  const angular = meters / EARTH_RADIUS;
  const lat1 = toRad(lat);
  const lng1 = toRad(lng);
  const ring = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i / steps) * 2 * Math.PI;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(angular) + Math.cos(lat1) * Math.sin(angular) * Math.cos(bearing));
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angular) * Math.cos(lat1),
        Math.cos(angular) - Math.sin(lat1) * Math.sin(lat2),
      );
    ring.push([toDeg(lng2), toDeg(lat2)]);
  }
  return { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] }, properties: {} };
}

export function circleBounds(lng, lat, meters) {
  const dLat = toDeg(meters / EARTH_RADIUS);
  const dLng = dLat / Math.cos(toRad(lat));
  return [
    [lng - dLng, lat - dLat],
    [lng + dLng, lat + dLat],
  ];
}

// Abuja city centre, used before we know where the user is
export const DEFAULT_CENTER = { lng: 7.4892, lat: 9.0579 };
