// OpenRouteService API Integration
const API_KEY = '5b3ce3597851110001cf62488e726f4c75ba4362b8dae90b3a7b8561';

class RouteService {
    constructor() {
        this.apiKey = API_KEY;
    }

    async getDirections(startCoords, endCoords, transportMode = 'driving-car') {
        try {
            console.log('Getting directions for:', { startCoords, endCoords });
            
            const response = await fetch('https://api.openrouteservice.org/v2/directions/' + transportMode + '/geojson', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    coordinates: [startCoords, endCoords]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`Failed to get directions: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getDirections:', error);
            throw error;
        }
    }

    async calculateRoute(startLocation, endLocation) {
        try {
            console.log('Calculating route between:', startLocation, 'and', endLocation);
            
            // First, geocode the locations to get coordinates
            const startCoords = await this.geocodeLocation(startLocation);
            console.log('Start coordinates:', startCoords);
            
            const endCoords = await this.geocodeLocation(endLocation);
            console.log('End coordinates:', endCoords);
            
            // Then get the directions
            return await this.getDirections(startCoords, endCoords);
        } catch (error) {
            console.error('Error in calculateRoute:', error);
            throw error;
        }
    }

    async geocodeLocation(locationString) {
        try {
            console.log('Geocoding location:', locationString);
            
            // Use the Nominatim API for geocoding (free and no API key required)
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': '3DRoutePlanner/1.0' // Required by Nominatim's terms
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to geocode location: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data || data.length === 0) {
                throw new Error(`No location found for: ${locationString}`);
            }

            // Return coordinates in [longitude, latitude] format
            return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        } catch (error) {
            console.error('Error in geocodeLocation:', error);
            throw error;
        }
    }
}

// Export the RouteService class
window.RouteService = RouteService; 