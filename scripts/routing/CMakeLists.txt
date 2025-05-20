cmake_minimum_required(VERSION 3.10)
project(HotelSorter)

# Set C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add source files
add_library(hotel_sorter
    HotelSorter.cpp
    HotelSorter.hpp
)

# Add test executable
add_executable(hotel_sorter_test main.cpp)
target_link_libraries(hotel_sorter_test hotel_sorter) 