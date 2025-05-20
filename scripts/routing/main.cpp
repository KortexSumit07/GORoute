#include <iostream>
#include <iomanip>
#include "HotelSorter.hpp"

// Function to print hotel information
void printHotel(const Hotel& hotel) {
    std::cout << std::left << std::setw(20) << hotel.name 
              << "Price Level: " << hotel.price_level 
              << ", Rating: " << std::fixed << std::setprecision(1) << hotel.rating 
              << std::endl;
}

int main() {
    // Create sample hotel data
    std::vector<Hotel> hotels = {
        Hotel("Luxury Inn", 3, 4.5),
        Hotel("Budget Stay", 1, 3.8),
        Hotel("Comfort Hotel", 2, 4.2),
        Hotel("Grand Plaza", 3, 4.7),
        Hotel("Cozy Lodge", 1, 4.0)
    };

    // Create copies for different sorting methods
    std::vector<Hotel> hotels_by_price = hotels;
    std::vector<Hotel> hotels_by_rating = hotels;

    // Sort and print by price (low to high)
    std::cout << "Sorting by price (low to high):\n";
    std::cout << "--------------------------------\n";
    HotelSorter::quickSortByPrice(hotels_by_price, 0, hotels_by_price.size() - 1);
    for (const auto& hotel : hotels_by_price) {
        printHotel(hotel);
    }

    // Sort and print by rating (high to low)
    std::cout << "\nSorting by rating (high to low):\n";
    std::cout << "--------------------------------\n";
    HotelSorter::quickSortByRating(hotels_by_rating, 0, hotels_by_rating.size() - 1);
    for (const auto& hotel : hotels_by_rating) {
        printHotel(hotel);
    }

    return 0;
} 