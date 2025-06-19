let map;
let directionsService;
let directionsRenderer;
let geocoder;

function initMap() {
  // Initialize the map centered on Delhi, India
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Initialize directions service and renderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById('directionsPanel'));

  // Initialize geocoder
  geocoder = new google.maps.Geocoder();
}

async function geocode(place) {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: place }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        reject(new Error('Geocode was not successful for the following reason: ' + status));
      }
    });
  });
}

async function getRoute() {
  const startPlace = document.getElementById('start').value.trim();
  const endPlace = document.getElementById('end').value.trim();
  
  if (!startPlace || !endPlace) {
    alert("Please enter both start and end locations");
    return;
  }

  try {
    // Geocode both locations
    const startCoords = await geocode(startPlace);
    const endCoords = await geocode(endPlace);

    // Create the route request
    const request = {
      origin: startCoords,
      destination: endCoords,
      travelMode: google.maps.TravelMode.DRIVING
    };

    // Get directions
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        
        // Display route information
        const route = result.routes[0];
        const leg = route.legs[0];
        
        console.log('Route found!');
        console.log('Distance: ' + leg.distance.text);
        console.log('Duration: ' + leg.duration.text);
        
        // You can add additional information display here if needed
      } else {
        alert('Directions request failed due to ' + status);
      }
    });

  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
}

// Add event listeners for Enter key
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('start').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      getRoute();
    }
  });
  
  document.getElementById('end').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      getRoute();
    }
  });
});
