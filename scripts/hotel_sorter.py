"""
Hotel Sorting Module

This module provides functions to sort hotels by cost and rating using the QuickSort algorithm.
It's designed to be beginner-friendly with clear explanations and examples.
"""

def quick_sort_by_price(hotels, low, high):
    """
    Sort hotels by price using QuickSort algorithm.
    
    Args:
        hotels: List of hotel dictionaries
        low: Starting index of the list
        high: Ending index of the list
    """
    if low < high:
        # Find the partition index
        partition_idx = partition_by_price(hotels, low, high)
        
        # Sort the left part
        quick_sort_by_price(hotels, low, partition_idx - 1)
        # Sort the right part
        quick_sort_by_price(hotels, partition_idx + 1, high)

def partition_by_price(hotels, low, high):
    """
    Helper function for QuickSort by price.
    Puts cheaper hotels to the left and more expensive ones to the right.
    """
    # Choose the rightmost element as pivot
    pivot = hotels[high]['price_level']
    
    # Index of smaller element
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        # If current element is less expensive than pivot
        if hotels[j]['price_level'] <= pivot:
            i += 1  # Increment index of smaller element
            hotels[i], hotels[j] = hotels[j], hotels[i]
    
    # Place pivot in its correct position
    hotels[i + 1], hotels[high] = hotels[high], hotels[i + 1]
    return i + 1

def quick_sort_by_rating(hotels, low, high):
    """
    Sort hotels by rating using QuickSort algorithm.
    Higher ratings will be first.
    
    Args:
        hotels: List of hotel dictionaries
        low: Starting index of the list
        high: Ending index of the list
    """
    if low < high:
        # Find the partition index
        partition_idx = partition_by_rating(hotels, low, high)
        
        # Sort the left part
        quick_sort_by_rating(hotels, low, partition_idx - 1)
        # Sort the right part
        quick_sort_by_rating(hotels, partition_idx + 1, high)

def partition_by_rating(hotels, low, high):
    """
    Helper function for QuickSort by rating.
    Puts higher rated hotels to the left and lower rated ones to the right.
    """
    # Choose the rightmost element as pivot
    pivot = hotels[high]['rating']
    
    # Index of smaller element
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        # If current element has higher rating than pivot
        if hotels[j]['rating'] >= pivot:
            i += 1  # Increment index of smaller element
            hotels[i], hotels[j] = hotels[j], hotels[i]
    
    # Place pivot in its correct position
    hotels[i + 1], hotels[high] = hotels[high], hotels[i + 1]
    return i + 1

# Example usage and test code
if __name__ == "__main__":
    # Sample hotel data
    sample_hotels = [
        {"name": "Luxury Inn", "price_level": 3, "rating": 4.5},
        {"name": "Budget Stay", "price_level": 1, "rating": 3.8},
        {"name": "Comfort Hotel", "price_level": 2, "rating": 4.2},
        {"name": "Grand Plaza", "price_level": 3, "rating": 4.7},
        {"name": "Cozy Lodge", "price_level": 1, "rating": 4.0}
    ]
    
    # Create a copy for each sort type
    hotels_by_price = sample_hotels.copy()
    hotels_by_rating = sample_hotels.copy()
    
    # Sort by price (low to high)
    print("Sorting by price (low to high):")
    quick_sort_by_price(hotels_by_price, 0, len(hotels_by_price) - 1)
    for hotel in hotels_by_price:
        print(f"{hotel['name']}: ${hotel['price_level']} - Rating: {hotel['rating']}")
    
    print("\nSorting by rating (high to low):")
    quick_sort_by_rating(hotels_by_rating, 0, len(hotels_by_rating) - 1)
    for hotel in hotels_by_rating:
        print(f"{hotel['name']}: Rating: {hotel['rating']} - ${hotel['price_level']}") 