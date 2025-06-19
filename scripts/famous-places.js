const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");
const searchBtn = document.getElementById("search-btn");
const locationInput = document.getElementById("location-input");

// Map for categories based on Foursquare category IDs:
// Source for category IDs: https://developer.foursquare.com/docs/categories
const categories = {
  spotlight: "16000",    // Landmarks & Outdoors
  hotspots: "13065,13032", // Nightlife spots (Bars & Clubs), Restaurants
  exploration: "16025,16019" // Parks, Museums & Art Galleries
};

function setActiveTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });
  contents.forEach((content) => {
    content.style.display = content.id === tabName ? "flex" : "none";
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tab);
  });
});

async function loadPlacesForAllTabs(lat, lon) {
  // Clear contents and show loading
  contents.forEach((content) => {
    content.innerHTML = "<p>Loading...</p>";
  });

  try {
    // Famous Places (no category filter, sorted by popularity)
    const famousPlaces = await fetchFamousPlaces(lat, lon);
    renderPlaces(famousPlaces, "famous");

    // City Spotlights - category Landmarks & Outdoors
    const spotlightPlaces = await fetchPlacesByCategory(lat, lon, categories.spotlight);
    renderPlaces(spotlightPlaces, "spotlight");

    // Hotspots - nightlife + restaurants
    const hotspotPlaces = await fetchPlacesByCategory(lat, lon, categories.hotspots);
    renderPlaces(hotspotPlaces, "hotspots");

    // Places for Exploration - parks, museums
    const explorationPlaces = await fetchPlacesByCategory(lat, lon, categories.exploration);
    renderPlaces(explorationPlaces, "exploration");
  } catch (error) {
    contents.forEach((content) => {
      content.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
  }
}

function renderPlaces(places, tabName) {
  const container = document.getElementById(tabName);
  if (!places || places.length === 0) {
    container.innerHTML = "<p>No places found.</p>";
    return;
  }
  container.innerHTML = "";

  places.forEach((place) => {
    const card = document.createElement("div");
    card.className = "place-card";

    const address = place.location?.formatted_address || place.location?.address || "Address not available";
    const category = place.categories && place.categories.length > 0 ? place.categories[0].name : "Category unknown";

    card.innerHTML = `
      <h3>${place.name}</h3>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Address:</strong> ${address}</p>
      <a href="https://foursquare.com/v/${place.fsq_id}" target="_blank" rel="noopener noreferrer">View on Foursquare</a>
    `;

    container.appendChild(card);
  });
}

searchBtn.addEventListener("click", async () => {
  const location = locationInput.value.trim();
  if (!location) {
    alert("Please enter a city or location.");
    return;
  }
  setActiveTab("famous");

  try {
    const { lat, lon } = await getCoordinates(location);
    await loadPlacesForAllTabs(lat, lon);
  } catch (error) {
    contents.forEach((content) => {
      content.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
  }
});
