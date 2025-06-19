class TripService {
    constructor() {
        this.STORAGE_KEY = 'goroute_trips';
        this.trips = this.loadTrips();
    }

    // Load trips from localStorage
    loadTrips() {
        const tripsData = localStorage.getItem(this.STORAGE_KEY);
        return tripsData ? JSON.parse(tripsData) : [];
    }

    // Save trips to localStorage
    saveTrips() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.trips));
    }

    // Add a new trip
    addTrip(trip) {
        // Generate a unique ID
        trip.id = Date.now();
        trip.createdAt = new Date().toISOString();
        this.trips.unshift(trip); // Add to beginning of array
        this.saveTrips();
        return trip;
    }

    // Get all trips
    getAllTrips() {
        return this.trips;
    }

    // Get trip by ID
    getTripById(id) {
        return this.trips.find(trip => trip.id === id);
    }

    // Delete trip
    deleteTrip(id) {
        this.trips = this.trips.filter(trip => trip.id !== id);
        this.saveTrips();
    }

    // Update trip
    updateTrip(id, updatedData) {
        const index = this.trips.findIndex(trip => trip.id === id);
        if (index !== -1) {
            this.trips[index] = { ...this.trips[index], ...updatedData };
            this.saveTrips();
            return this.trips[index];
        }
        return null;
    }

    // Filter trips by date range
    filterTripsByDate(startDate, endDate) {
        return this.trips.filter(trip => {
            const tripDate = new Date(trip.startDate);
            return (!startDate || tripDate >= new Date(startDate)) &&
                   (!endDate || tripDate <= new Date(endDate));
        });
    }

    // Search trips by destination
    searchTrips(searchTerm) {
        if (!searchTerm) return this.trips;
        
        searchTerm = searchTerm.toLowerCase();
        return this.trips.filter(trip => 
            trip.destination.toLowerCase().includes(searchTerm) ||
            trip.description?.toLowerCase().includes(searchTerm)
        );
    }
} 