const fetch = require("node-fetch");
require("dotenv").config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

async function geocodeAddress(addressText) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    addressText
  )}&key=${OPENCAGE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || !data.results.length)
    throw new Error("Address not found");

  console.log("Full geocoding components:", data.results[0].components);

  const result = data.results[0];

  return {
    coordinates: [result.geometry.lng, result.geometry.lat],
    components: result.components,
    formatted: result.formatted,
  };
}

module.exports = { geocodeAddress };
