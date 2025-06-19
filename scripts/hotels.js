const hotelService = new HotelService();

// DOM Elements
const hotelSearch = document.getElementById('hotelSearch');
const useLocationBtn = document.getElementById('useLocation');
const locationInput = document.getElementById('locationInput');
const radiusInput = document.getElementById('radiusInput');
const radiusValue = document.getElementById('radiusValue');
const priceFilter = document.getElementById('priceFilter');
const ratingFilter = document.getElementById('ratingFilter');
const searchBtn = document.getElementById('searchBtn');
const hotelsList = document.getElementById('hotelsList');
const resultsInfo = document.getElementById('resultsInfo');
const noResults = document.getElementById('noResults');
const loading = document.getElementById('loading');
const modal = document.getElementById('hotelModal');
const modalClose = document.querySelector('.close');

// Current search state
let currentLocation = null;
let lastSearchTerm = '';

// Event Listeners
useLocationBtn.addEventListener('click', handleLocationSearch);
searchBtn.addEventListener('click', handleSearch);
hotelSearch.addEventListener('input', debounce(handleNameSearch, 500));
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
radiusInput.addEventListener('input', () => {
    radiusValue.textContent = `${radiusInput.value} km`;
    if (currentLocation) handleSearch();
});
priceFilter.addEventListener('change', () => currentLocation && handleSearch());
ratingFilter.addEventListener('change', () => currentLocation && handleSearch());
modalClose.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Handle location-based search
async function handleLocationSearch() {
    try {
        useLocationBtn.disabled = true;
        useLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        locationInput.value = '';
        showLoading('Getting your location...');

        const position = await getCurrentPosition();
        currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        console.log('Got location:', currentLocation);
        await performSearch();
    } catch (error) {
        console.error('Location error:', error);
        showError('Could not get your location. Please enter a location manually.');
    } finally {
        useLocationBtn.disabled = false;
        useLocationBtn.innerHTML = '<i class="fas fa-location-dot"></i> Use My Location';
    }
}

// Handle search button click
async function handleSearch() {
    const location = locationInput.value.trim();
    if (!location && !currentLocation) {
        showError('Please enter a location or use your current location');
        return;
    }

    if (location) {
        try {
            showLoading('Searching for location...');
            const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${hotelService.API_KEY}`;
            const response = await fetch(geocodeUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Geocoding response:', data);

            if (!data.features || data.features.length === 0) {
                showError('Location not found. Please try a different search term.');
                return;
            }

            currentLocation = {
                lat: data.features[0].properties.lat,
                lng: data.features[0].properties.lon
            };

            console.log('Found location:', currentLocation);
            await performSearch();
        } catch (error) {
            console.error('Search error:', error);
            showError('Error searching for location. Please try again.');
        }
    } else {
        await performSearch();
    }
}

// Handle hotel name search
async function handleNameSearch(e) {
    const searchTerm = e.target.value.trim();
    if (searchTerm === lastSearchTerm) return;
    lastSearchTerm = searchTerm;

    if (!searchTerm) {
        if (currentLocation) performSearch();
        return;
    }

    if (!currentLocation) {
        showError('Please select a location first');
        return;
    }

    try {
        showLoading('Searching hotels...');
        const hotels = await hotelService.searchHotelsByName(
            searchTerm,
            currentLocation.lat,
            currentLocation.lng
        );
        displayHotels(filterHotels(hotels));
    } catch (error) {
        console.error('Name search error:', error);
        showError('Error searching hotels. Please try again.');
    }
}

// Perform search with current filters
async function performSearch() {
    if (!currentLocation) return;

    try {
        showLoading('Searching for hotels...');
        const hotels = await hotelService.searchHotelsNearby(
            currentLocation.lat,
            currentLocation.lng,
            radiusInput.value * 1000
        );
        displayHotels(filterHotels(hotels));
    } catch (error) {
        console.error('Search error:', error);
        showError('Error searching for hotels. Please try again.');
    }
}

// Filter hotels based on current filter settings
function filterHotels(hotels) {
    if (!Array.isArray(hotels)) {
        console.error('Invalid hotels data:', hotels);
        return [];
    }
    
    // First filter the hotels
    const filteredHotels = hotels.filter(hotel => {
        if (!hotel) return false;
        const matchesRating = !ratingFilter.value || (hotel.rating && hotel.rating >= parseFloat(ratingFilter.value));
        const matchesPrice = !priceFilter.value || (hotel.price_level === priceFilter.value);
        return matchesRating && matchesPrice;
    });

    // Then sort by rating (Python-like sorting)
    return filteredHotels.sort((a, b) => {
        // Handle null/undefined ratings like Python (None values go to the end)
        if (a.rating === null || a.rating === undefined) return 1;
        if (b.rating === null || b.rating === undefined) return -1;
        // Sort in descending order (highest rating first)
        return b.rating - a.rating;
    });
}

// Display hotels in the grid
function displayHotels(hotels) {
    hideLoading();
    
    if (!Array.isArray(hotels) || hotels.length === 0) {
        showNoResults();
        return;
    }

    noResults.style.display = 'none';
    hotelsList.style.display = 'grid';
    resultsInfo.textContent = `Found ${hotels.length} hotels`;
    
    hotelsList.innerHTML = hotels.map(hotel => {
        if (!hotel) return '';
        return `
            <div class="hotel-card" onclick="showHotelDetails('${hotel.placeId}')">
                <img src="${hotel.image || 'images/default-hotel.jpg'}" alt="${hotel.name}" class="hotel-image">
                <div class="hotel-info">
                    <h3 class="hotel-name">${hotel.name}</h3>
                    <div class="hotel-rating">
                        ${getStarRating(hotel.rating)}
                    </div>
                    <p class="hotel-address">${hotel.address}</p>
                    <p class="hotel-price">${getPriceLevel(hotel.price_level)}</p>
                    ${hotel.amenities && hotel.amenities.length > 0 ? `
                        <div class="hotel-amenities">
                            ${hotel.amenities.slice(0, 5).map(amenity => `
                                <span class="amenity-tag">${amenity}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Show hotel details in modal
async function showHotelDetails(placeId) {
    try {
        modal.style.display = 'block';
        document.getElementById('hotelDetails').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading hotel details...</p>
            </div>
        `;

        const details = await hotelService.getHotelDetails(placeId);
        
        document.getElementById('hotelDetails').innerHTML = `
            <h2>${details.properties.name}</h2>
            <div class="hotel-details">
                <p><i class="fas fa-map-marker-alt"></i> ${details.properties.formatted}</p>
                ${details.properties.website ? `
                    <p><i class="fas fa-globe"></i> <a href="${details.properties.website}" target="_blank">Visit Website</a></p>
                ` : ''}
                ${details.properties.phone ? `
                    <p><i class="fas fa-phone"></i> ${details.properties.phone}</p>
                ` : ''}
                ${details.properties.opening_hours ? `
                    <p><i class="fas fa-clock"></i> ${formatOpeningHours(details.properties.opening_hours)}</p>
                ` : ''}
                ${details.properties.description ? `
                    <p><i class="fas fa-info-circle"></i> ${details.properties.description}</p>
                ` : ''}
            </div>
        `;
    } catch (error) {
        document.getElementById('hotelDetails').innerHTML = `
            <div class="error">Error loading hotel details. Please try again.</div>
        `;
        console.error('Error fetching hotel details:', error);
    }
}

// Helper Functions
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    });
}

function getStarRating(rating) {
    if (!rating) return 'No rating';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return `${stars} <span>(${rating})</span>`;
}

function getPriceLevel(level) {
    const prices = {
        '1': '$',
        '2': '$$',
        '3': '$$$'
    };
    return prices[level] || 'Price not available';
}

function formatOpeningHours(hours) {
    if (typeof hours === 'string') return hours;
    if (!hours) return 'Opening hours not available';
    try {
        return Object.entries(hours)
            .map(([day, time]) => `${day}: ${time}`)
            .join('<br>');
    } catch (error) {
        return JSON.stringify(hours);
    }
}

function showLoading(message = 'Loading...') {
    loading.style.display = 'block';
    loading.querySelector('p').textContent = message;
    noResults.style.display = 'none';
    hotelsList.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    hideLoading();
    noResults.style.display = 'block';
    hotelsList.style.display = 'none';
    document.querySelector('#noResults p').textContent = message;
}

function showNoResults() {
    noResults.style.display = 'block';
    hotelsList.style.display = 'none';
    resultsInfo.textContent = 'No hotels found';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 