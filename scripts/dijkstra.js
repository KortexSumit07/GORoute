class DijkstraRouter {
    constructor() {
        this.graph = new Map(); // Adjacency list representation of the graph
        this.geocoder = null;
        this.distanceMatrixService = null;
        this.googleMapsApiKey = 'AIzaSyCUc2f29h_gg7B53mOoAKvV3ABE0pTdAio';
    }

    // Initialize Google Maps services
    initializeGoogleMapsServices() {
        if (typeof google !== 'undefined' && google.maps) {
            this.geocoder = new google.maps.Geocoder();
            this.distanceMatrixService = new google.maps.DistanceMatrixService();
        } else {
            console.warn('Google Maps API not loaded. Some features may not work.');
        }
    }

    // Geocode a location using Google Maps API
    async geocodeLocation(locationString) {
        if (!this.geocoder) {
            throw new Error('Google Maps Geocoder not initialized');
        }

        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ address: locationString }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    resolve({ lat: location.lat(), lng: location.lng() });
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    }

    // Calculate distance between two points using Google Maps Distance Matrix
    async calculateGoogleMapsDistance(origin, destination) {
        if (!this.distanceMatrixService) {
            throw new Error('Google Maps Distance Matrix Service not initialized');
        }

        return new Promise((resolve, reject) => {
            const request = {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            };

            this.distanceMatrixService.getDistanceMatrix(request, (response, status) => {
                if (status === 'OK') {
                    const element = response.rows[0].elements[0];
                    if (element.status === 'OK') {
                        resolve(element.distance.value); // Distance in meters
                    } else {
                        reject(new Error(`Distance calculation failed: ${element.status}`));
                    }
                } else {
                    reject(new Error(`Distance Matrix request failed: ${status}`));
                }
            });
        });
    }

    // Add a node to the graph
    addNode(node) {
        if (!this.graph.has(node)) {
            this.graph.set(node, new Map());
        }
    }

    // Add an edge between two nodes with a weight
    addEdge(from, to, weight) {
        this.addNode(from);
        this.addNode(to);
        this.graph.get(from).set(to, weight);
        this.graph.get(to).set(from, weight); // For undirected graph
    }

    // Find the shortest path using Dijkstra's algorithm
    findShortestPath(start, end) {
        if (!this.graph.has(start) || !this.graph.has(end)) {
            throw new Error('Start or end node not found in the graph');
        }

        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();

        // Initialize distances
        for (const node of this.graph.keys()) {
            distances.set(node, Infinity);
            previous.set(node, null);
            unvisited.add(node);
        }
        distances.set(start, 0);

        while (unvisited.size > 0) {
            // Find the unvisited node with the smallest distance
            let current = null;
            let smallestDistance = Infinity;
            for (const node of unvisited) {
                if (distances.get(node) < smallestDistance) {
                    current = node;
                    smallestDistance = distances.get(node);
                }
            }

            if (current === null) break; // No path exists
            if (current === end) break; // Found the end node

            unvisited.delete(current);

            // Update distances to neighbors
            for (const [neighbor, weight] of this.graph.get(current)) {
                if (!unvisited.has(neighbor)) continue;

                const distance = distances.get(current) + weight;
                if (distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    previous.set(neighbor, current);
                }
            }
        }

        // Reconstruct the path
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return {
            path: path,
            distance: distances.get(end)
        };
    }

    // Build graph from location names using Google Maps API
    async buildGraphFromLocations(locations, connections) {
        // Clear existing graph
        this.graph.clear();

        // Initialize Google Maps services if not already done
        this.initializeGoogleMapsServices();

        // Geocode all locations
        const locationCoords = new Map();
        for (const location of locations) {
            try {
                const coords = await this.geocodeLocation(location);
                locationCoords.set(location, coords);
                this.addNode(location);
            } catch (error) {
                console.error(`Failed to geocode location: ${location}`, error);
                throw error;
            }
        }

        // Add connections between locations using Google Maps distances
        for (const connection of connections) {
            const [from, to] = connection;
            if (locationCoords.has(from) && locationCoords.has(to)) {
                try {
                    const distance = await this.calculateGoogleMapsDistance(
                        locationCoords.get(from),
                        locationCoords.get(to)
                    );
                    this.addEdge(from, to, distance);
                } catch (error) {
                    console.error(`Failed to calculate distance between ${from} and ${to}`, error);
                    // Fallback to Euclidean distance if Google Maps fails
                    const fallbackDistance = this.calculateEuclideanDistance(
                        locationCoords.get(from),
                        locationCoords.get(to)
                    );
                    this.addEdge(from, to, fallbackDistance);
                }
            }
        }
    }

    // Convert coordinates to a graph representation (legacy method)
    buildGraphFromCoordinates(coordinates, connections) {
        // Clear existing graph
        this.graph.clear();

        // Add all coordinates as nodes
        coordinates.forEach(coord => {
            this.addNode(coord);
        });

        // Add connections between coordinates
        connections.forEach(connection => {
            const [from, to] = connection;
            // Calculate Euclidean distance as weight
            const weight = this.calculateEuclideanDistance(
                coordinates[from],
                coordinates[to]
            );
            this.addEdge(coordinates[from], coordinates[to], weight);
        });
    }

    // Calculate Euclidean distance between two points (fallback method)
    calculateEuclideanDistance(point1, point2) {
        const [x1, y1] = point1;
        const [x2, y2] = point2;
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Find optimal route between multiple locations
    async findOptimalRoute(locations) {
        if (locations.length < 2) {
            throw new Error('At least 2 locations are required');
        }

        // Build graph from locations
        const connections = [];
        for (let i = 0; i < locations.length; i++) {
            for (let j = i + 1; j < locations.length; j++) {
                connections.push([locations[i], locations[j]]);
            }
        }

        await this.buildGraphFromLocations(locations, connections);

        // Find shortest path from first to last location
        return this.findShortestPath(locations[0], locations[locations.length - 1]);
    }
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DijkstraRouter;
}

// Make available globally for browser environment
if (typeof window !== 'undefined') {
    window.DijkstraRouter = DijkstraRouter;
} 