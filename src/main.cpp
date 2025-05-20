#include "DijkstraRouter.h"
#include <iostream>

int main() {
    // Create a graph with 5 nodes
    DijkstraRouter router(5);

    // Example 1: Manual edge addition
    router.addEdge(0, 1, 4.0);  // Edge from node 0 to 1 with weight 4
    router.addEdge(0, 2, 2.0);  // Edge from node 0 to 2 with weight 2
    router.addEdge(1, 2, 1.0);  // Edge from node 1 to 2 with weight 1
    router.addEdge(1, 3, 5.0);  // Edge from node 1 to 3 with weight 5
    router.addEdge(2, 3, 8.0);  // Edge from node 2 to 3 with weight 8
    router.addEdge(2, 4, 10.0); // Edge from node 2 to 4 with weight 10
    router.addEdge(3, 4, 2.0);  // Edge from node 3 to 4 with weight 2

    // Find shortest path from node 0 to node 4
    auto result = router.findShortestPath(0, 4);
    
    std::cout << "Shortest path from 0 to 4:" << std::endl;
    std::cout << "Path: ";
    for (int node : result.first) {
        std::cout << node << " ";
    }
    std::cout << std::endl;
    std::cout << "Total distance: " << result.second << std::endl;

    // Example 2: Coordinate-based graph
    std::vector<std::pair<double, double>> coordinates = {
        {0.0, 0.0},  // Node 0
        {1.0, 1.0},  // Node 1
        {2.0, 2.0},  // Node 2
        {3.0, 1.0},  // Node 3
        {4.0, 0.0}   // Node 4
    };

    std::vector<std::pair<int, int>> connections = {
        {0, 1}, {1, 2}, {2, 3}, {3, 4},  // Connect nodes in sequence
        {0, 2}, {1, 3}, {2, 4}           // Add some cross connections
    };

    router.buildGraphFromCoordinates(coordinates, connections);
    
    // Find shortest path in the coordinate-based graph
    result = router.findShortestPath(0, 4);
    
    std::cout << "\nShortest path in coordinate-based graph:" << std::endl;
    std::cout << "Path: ";
    for (int node : result.first) {
        std::cout << node << " ";
    }
    std::cout << std::endl;
    std::cout << "Total distance: " << result.second << std::endl;

    return 0;
} 