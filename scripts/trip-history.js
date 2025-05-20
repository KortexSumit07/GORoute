// Initialize the trip service
const tripService = new TripService();

// Initialize date pickers
document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#date-from", {
        dateFormat: "Y-m-d",
        onChange: filterTrips
    });

    flatpickr("#date-to", {
        dateFormat: "Y-m-d",
        onChange: filterTrips
    });

    // Initial load of trips
    displayTrips(tripService.getAllTrips());
});

// Function to create trip card HTML
function createTripCard(trip) {
    const startDate = formatDate(trip.startDate);
    const endDate = trip.endDate ? formatDate(trip.endDate) : 'Ongoing';
    
    return `
        <div class="trip-card" data-trip-id="${trip.id}">
            <img src="${trip.image || 'images/default-trip.jpg'}" alt="${trip.destination}" class="trip-image">
            <div class="trip-info">
                <h3>${trip.destination}</h3>
                <div class="trip-dates">
                    <i class="fas fa-calendar"></i>
                    <span>${startDate} - ${endDate}</span>
                </div>
                <div class="trip-stats">
                    <div class="stat">
                        <div class="stat-value">${trip.places || 0}</div>
                        <div class="stat-label">Places</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${trip.hotels || 0}</div>
                        <div class="stat-label">Hotels</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${trip.distance || 0}</div>
                        <div class="stat-label">km</div>
                    </div>
                </div>
                <div class="trip-actions">
                    <button onclick="editTrip(${trip.id})" class="action-btn edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteTrip(${trip.id})" class="action-btn delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to filter and display trips
function filterTrips() {
    const searchTerm = document.getElementById('trip-search').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;

    let filteredTrips = tripService.getAllTrips();

    // Apply search filter
    if (searchTerm) {
        filteredTrips = tripService.searchTrips(searchTerm);
    }

    // Apply date filter
    if (dateFrom || dateTo) {
        filteredTrips = tripService.filterTripsByDate(dateFrom, dateTo);
    }

    displayTrips(filteredTrips);
}

// Function to display trips
function displayTrips(trips) {
    const container = document.getElementById('trips-container');
    if (trips.length === 0) {
        container.innerHTML = `
            <div class="no-trips">
                <i class="fas fa-route"></i>
                <h3>No trips found</h3>
                <p>Start planning your next adventure!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = trips.map(trip => createTripCard(trip)).join('');
}

// Function to save current route as a trip
function saveCurrentRoute(routeData) {
    const trip = {
        destination: routeData.destination,
        startDate: new Date().toISOString(),
        distance: routeData.totalDistance.toFixed(1),
        places: routeData.steps.length,
        image: routeData.image || 'images/default-trip.jpg',
        route: routeData.steps,
        description: `Trip to ${routeData.destination}`
    };

    tripService.addTrip(trip);
}

// Function to edit trip
function editTrip(tripId) {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    // Create and show edit modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Trip</h2>
            <form id="edit-trip-form">
                <div class="form-group">
                    <label for="edit-destination">Destination</label>
                    <input type="text" id="edit-destination" value="${trip.destination}" required>
                </div>
                <div class="form-group">
                    <label for="edit-start-date">Start Date</label>
                    <input type="date" id="edit-start-date" value="${trip.startDate.split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="edit-end-date">End Date</label>
                    <input type="date" id="edit-end-date" value="${trip.endDate ? trip.endDate.split('T')[0] : ''}">
                </div>
                <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description">${trip.description || ''}</textarea>
                </div>
                <button type="submit" class="filter-button">Save Changes</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle modal close
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    }

    // Handle form submission
    const form = modal.querySelector('#edit-trip-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const updatedData = {
            destination: document.getElementById('edit-destination').value,
            startDate: document.getElementById('edit-start-date').value,
            endDate: document.getElementById('edit-end-date').value || null,
            description: document.getElementById('edit-description').value
        };

        tripService.updateTrip(tripId, updatedData);
        displayTrips(tripService.getAllTrips());
        modal.remove();
    }
}

// Function to delete trip
function deleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this trip?')) {
        tripService.deleteTrip(tripId);
        displayTrips(tripService.getAllTrips());
    }
}

// Add search event listener
document.getElementById('trip-search').addEventListener('input', filterTrips); 