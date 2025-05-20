#include "HotelSorter.hpp"

// Swap utility function implementation
void HotelSorter::swap(Hotel& a, Hotel& b) {
    Hotel temp = a;
    a = b;
    b = temp;
}

// Partition function for price-based sorting
int HotelSorter::partitionByPrice(std::vector<Hotel>& hotels, int low, int high) {
    // Choose the rightmost element as pivot
    int pivot = hotels[high].price_level;
    
    // Index of smaller element
    int i = low - 1;
    
    // Compare each element with pivot
    for (int j = low; j < high; j++) {
        // If current element is less expensive than pivot
        if (hotels[j].price_level <= pivot) {
            i++;  // Increment index of smaller element
            swap(hotels[i], hotels[j]);
        }
    }
    
    // Place pivot in its correct position
    swap(hotels[i + 1], hotels[high]);
    return i + 1;
}

// QuickSort implementation for price-based sorting
void HotelSorter::quickSortByPrice(std::vector<Hotel>& hotels, int low, int high) {
    if (low < high) {
        // Find the partition index
        int partition_idx = partitionByPrice(hotels, low, high);
        
        // Sort the left part
        quickSortByPrice(hotels, low, partition_idx - 1);
        // Sort the right part
        quickSortByPrice(hotels, partition_idx + 1, high);
    }
}

// Partition function for rating-based sorting
int HotelSorter::partitionByRating(std::vector<Hotel>& hotels, int low, int high) {
    // Choose the rightmost element as pivot
    double pivot = hotels[high].rating;
    
    // Index of smaller element
    int i = low - 1;
    
    // Compare each element with pivot
    for (int j = low; j < high; j++) {
        // If current element has higher rating than pivot (for descending order)
        if (hotels[j].rating >= pivot) {
            i++;  // Increment index of smaller element
            swap(hotels[i], hotels[j]);
        }
    }
    
    // Place pivot in its correct position
    swap(hotels[i + 1], hotels[high]);
    return i + 1;
}

// QuickSort implementation for rating-based sorting
void HotelSorter::quickSortByRating(std::vector<Hotel>& hotels, int low, int high) {
    if (low < high) {
        // Find the partition index
        int partition_idx = partitionByRating(hotels, low, high);
        
        // Sort the left part
        quickSortByRating(hotels, low, partition_idx - 1);
        // Sort the right part
        quickSortByRating(hotels, partition_idx + 1, high);
    }
} 