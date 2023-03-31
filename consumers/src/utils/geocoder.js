const NodeGeocoder = require('node-geocoder');

// 'node-geocoder' is a node library for geocoding and reverse geocoding. 

const options = {
  provider: process.env.GEOCODER_PROVIDER, // There are a lot of geocoder such as google but would use "MapQuest"
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,     // This would be gotten wen u open an account with ur provider above; its called the Consumer Key
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;