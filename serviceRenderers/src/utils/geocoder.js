const NodeGeocoder = require("node-geocoder");
const { geocoder: options } = require("../config");

// node-geocoder wraps several providers. OpenStreetMap (Nominatim) needs no key;
// set GEOCODER_PROVIDER/GEOCODER_API_KEY to use mapquest, google, etc.
const geocoder = NodeGeocoder({
  provider: options.provider,
  apiKey: options.apiKey,
  formatter: null,
  // Nominatim's usage policy requires an identifying user agent
  fetch: (url, opts = {}) =>
    fetch(url, {
      ...opts,
      headers: { ...opts.headers, "user-agent": "servicesmgtapi/2.0" },
    }),
});

class GeocodeError extends Error {}

// Resolves a free-text address to { lng, lat, formattedAddress } or throws a
// GeocodeError with a message that is safe to show to the user.
const geocodeAddress = async (address) => {
  let results;
  try {
    results = await geocoder.geocode(address);
  } catch (err) {
    throw new GeocodeError("We couldn't reach the location service. Please try again.");
  }
  const [match] = results || [];
  if (!match) {
    throw new GeocodeError(
      `We couldn't find "${address}". Try adding the city or state.`
    );
  }
  return {
    lng: match.longitude,
    lat: match.latitude,
    formattedAddress:
      match.formattedAddress ||
      [match.streetName, match.city, match.state, match.country].filter(Boolean).join(", "),
  };
};

module.exports = { geocodeAddress, GeocodeError };
