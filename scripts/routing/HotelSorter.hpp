#ifndef HOTEL_SORTER_HPP
#define HOTEL_SORTER_HPP

#include <vector>
#include <string>

// Structure to represent a hotel
struct Hotel {
    std::string name;
    int price_level;  // 1: Budget, 2: Moderate, 3: Luxury
    double rating;    // Rating from 0.0 to 5.0

    Hotel(const std::string& n, int p, double r) 
        : name(n), price_level(p), rating(r) {}
};

class HotelSorter {
public:
    // Sort hotels by price (low to high)
    static void quickSortByPrice(std::vector<Hotel>& hotels, int low, int high);
    
    // Sort hotels by rating (high to low)
    static void quickSortByRating(std::vector<Hotel>& hotels, int low, int high);

private:
    // Helper functions for QuickSort
    static int partitionByPrice(std::vector<Hotel>& hotels, int low, int high);
    static int partitionByRating(std::vector<Hotel>& hotels, int low, int high);
    
    // Utility function to swap hotels
    static void swap(Hotel& a, Hotel& b);
};

#endif // HOTEL_SORTER_HPP 