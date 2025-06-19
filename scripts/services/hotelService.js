class HotelService {
    constructor() {
        this.API_KEY = 'e3afafad9d6a45368583c4098ed27a3e';
        this.BASE_URL = 'https://api.geoapify.com/v2/places';
        this.DETAILS_URL = 'https://api.geoapify.com/v2/place-details';
    }

    async searchHotelsNearby(latitude, longitude, radius = 5000) {
        try {
            console.log('Searching hotels with params:', { latitude, longitude, radius });

            const url = `${this.BASE_URL}?categories=accommodation.hotel&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=20&apiKey=${this.API_KEY}`;
            console.log('API URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (!data.features) {
                console.log('No features in response');
                return [];
            }

            const hotels = data.features.map(hotel => this.mapHotelData(hotel));
            console.log('Mapped hotels:', hotels);
            return hotels;

        } catch (error) {
            console.error('Error in searchHotelsNearby:', error);
            throw error;
        }
    }

    async searchHotelsByName(searchTerm, latitude, longitude) {
        try {
            console.log('Searching hotels by name:', searchTerm);

            const url = `${this.BASE_URL}?categories=accommodation.hotel&name=${encodeURIComponent(searchTerm)}&filter=circle:${longitude},${latitude},50000&bias=proximity:${longitude},${latitude}&limit=20&apiKey=${this.API_KEY}`;
            console.log('API URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            if (!data.features) {
                console.log('No features in response');
                return [];
            }

            const hotels = data.features.map(hotel => this.mapHotelData(hotel));
            console.log('Mapped hotels:', hotels);
            return hotels;

        } catch (error) {
            console.error('Error in searchHotelsByName:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('noResults').style.display = 'block';
            document.querySelector('#noResults p').textContent = 'Error searching for hotels. Please try again.';
            throw error;
        }
    }

    async getHotelDetails(placeId) {
        try {
            console.log('Getting hotel details for:', placeId);

            const url = `${this.DETAILS_URL}?id=${encodeURIComponent(placeId)}&apiKey=${this.API_KEY}`;
            console.log('API URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (!data.features || data.features.length === 0) {
                console.log('No hotel details found');
                throw new Error('Hotel details not found');
            }

            const details = data.features[0].properties;
            return {
                name: details.name,
                formatted_address: details.formatted,
                rating: this.calculateRating(details),
                price_level: details.price_level || 'N/A',
                phone: details.contact?.phone,
                website: details.contact?.website,
                opening_hours: this.formatOpeningHours(details.opening_hours),
                amenities: this.getAmenities(details),
                images: details.images || [],
                reviews: details.reviews || [],
                description: details.description,
                room_types: details.accommodation?.room_types || [],
                facilities: details.facilities || [],
                accessibility: details.accessibility || [],
                location: {
                    lat: data.features[0].geometry.coordinates[1],
                    lng: data.features[0].geometry.coordinates[0]
                }
            };
        } catch (error) {
            console.error('Error in getHotelDetails:', error);
            throw error;
        }
    }

    mapHotelData(hotel) {
        try {
            const properties = hotel.properties;
            return {
                placeId: properties.place_id,
                name: properties.name || 'Unnamed Hotel',
                address: properties.formatted,
                distance: properties.distance,
                rating: this.calculateRating(properties),
                image: properties.images ? properties.images[0] : null,
                amenities: this.getAmenities(properties),
                price_level: properties.price_level || 'N/A',
                coordinates: {
                    lat: hotel.geometry.coordinates[1],
                    lng: hotel.geometry.coordinates[0]
                }
            };
        } catch (error) {
            console.error('Error mapping hotel data:', error);
            return null;
        }
    }

    calculateRating(properties) {
        try {
            if (properties.rating) {
                return properties.rating;
            } else if (properties.reviews_count && properties.reviews_score) {
                return (properties.reviews_score / 2).toFixed(1);
            }
            return null;
        } catch (error) {
            console.error('Error calculating rating:', error);
            return null;
        }
    }

    getAmenities(properties) {
        try {
            const amenities = [];
            if (properties.facilities) {
                amenities.push(...properties.facilities);
            }
            if (properties.wifi) amenities.push('WiFi');
            if (properties.parking) amenities.push('Parking');
            if (properties.air_conditioning) amenities.push('AC');
            if (properties.swimming_pool) amenities.push('Pool');
            if (properties.restaurant) amenities.push('Restaurant');
            return [...new Set(amenities)]; // Remove duplicates
        } catch (error) {
            console.error('Error getting amenities:', error);
            return [];
        }
    }

    formatOpeningHours(hours) {
        try {
            if (!hours) return null;
            
            const daysMap = {
                'Mo': 'Monday',
                'Tu': 'Tuesday',
                'We': 'Wednesday',
                'Th': 'Thursday',
                'Fr': 'Friday',
                'Sa': 'Saturday',
                'Su': 'Sunday'
            };

            return Object.entries(hours).map(([day, times]) => {
                const fullDay = daysMap[day] || day;
                return `${fullDay}: ${times}`;
            });
        } catch (error) {
            console.error('Error formatting opening hours:', error);
            return null;
        }
    }
} 