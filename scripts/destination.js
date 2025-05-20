
const apiKey = "5b3ce3597851110001cf62488e726f4c75ba4362b8dae90b3a7b8561";
const map = L.map('map').setView([28.6139, 77.2090], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

let routeLayer, startMarker, endMarker;

async function geocode(place) {
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(place)}&size=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch geocode');
  const data = await res.json();
  if (data.features.length === 0) throw new Error('Place not found: ' + place);
  const [lon, lat] = data.features[0].geometry.coordinates;
  return [lat, lon];
}

async function getRoute() {
  const startPlace = document.getElementById('start').value.trim();
  const endPlace = document.getElementById('end').value.trim();
  if (!startPlace || !endPlace) return alert("Enter both start and end locations");

  try {
    const startCoords = await geocode(startPlace);
    const endCoords = await geocode(endPlace);

    if (routeLayer) map.removeLayer(routeLayer);
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);

    startMarker = L.marker(startCoords).addTo(map).bindPopup("Start: " + startPlace).openPopup();
    endMarker = L.marker(endCoords).addTo(map).bindPopup("End: " + endPlace).openPopup();

    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    const body = {
      coordinates: [
        [startCoords[1], startCoords[0]],
        [endCoords[1], endCoords[0]]
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ORS API Error:", errorText);
      alert("Failed to fetch route. Check the locations or try again later.");
      return;
    }

    const data = await response.json();

    routeLayer = L.geoJSON(data, {
      style: { color: 'blue', weight: 5 }
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds());

    const instructions = data.features[0].properties.segments[0].steps;
    const directionsList = document.getElementById('directionsList');
    directionsList.innerHTML = '';
    instructions.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step.instruction;
      directionsList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
