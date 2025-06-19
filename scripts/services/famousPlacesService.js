const API_KEY = "fsq3J2hcuWd+JQY3IzmLMG5rp//jozmbRjCJB6ZHiVmzIec=";

async function fetchPlacesByCategory(lat, lon, categoryIds) {
  // categoryIds is a comma separated string of category IDs for Foursquare
  const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&categories=${categoryIds}&limit=10`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching places: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
}

// For general "Famous Places" without filtering categories
async function fetchFamousPlaces(lat, lon) {
  const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&sort=POPULARITY&limit=10`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching famous places: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
}

async function getCoordinates(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not fetch location coordinates");

  const data = await response.json();
  if (data.length === 0) throw new Error("Location not found");

  return { lat: data[0].lat, lon: data[0].lon };
}
