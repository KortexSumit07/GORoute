# GORoute - Efficient Route Planning System

GORoute is a sophisticated route planning system that implements Dijkstra's algorithm for finding optimal paths between locations. This project provides an efficient and reliable solution for calculating shortest routes in various applications.

## Features

- **Dijkstra's Algorithm Implementation**: A robust implementation of Dijkstra's algorithm for finding the shortest path between two points
- **Graph-based Routing**: Efficient graph representation using adjacency lists
- **Coordinate-based Routing**: Support for geographical coordinates with automatic distance calculations
- **Flexible Graph Building**: Multiple ways to build the routing graph:
  - Manual node and edge addition
  - Automatic graph construction from coordinate sets
- **Undirected Graph Support**: Handles bidirectional routes between points
- **Distance Calculations**: Built-in Euclidean distance calculations for coordinate-based routing

## Technical Implementation

The core routing system is implemented in JavaScript with the following key components:

### Graph Structure
- Uses Map-based adjacency lists for efficient graph representation
- Supports weighted edges for accurate distance calculations
- Maintains undirected graph relationships

### Dijkstra's Algorithm
- Efficient shortest path finding
- Handles disconnected graphs gracefully
- Returns both the path and total distance
- Time complexity: O((V + E) log V) where V is vertices and E is edges

### Coordinate System
- Supports 2D coordinate points
- Automatic distance calculations between points
- Flexible coordinate-based graph construction

## Usage

```javascript
const router = new DijkstraRouter();

// Method 1: Manual graph building
router.addEdge('A', 'B', 5);
router.addEdge('B', 'C', 3);

// Method 2: Coordinate-based graph building
const coordinates = [
    [0, 0],  // point A
    [1, 1],  // point B
    [2, 2]   // point C
];
const connections = [
    [0, 1],  // connect A to B
    [1, 2]   // connect B to C
];
router.buildGraphFromCoordinates(coordinates, connections);

// Find shortest path
const result = router.findShortestPath(startPoint, endPoint);
console.log(result.path);      // Array of points in the path
console.log(result.distance);  // Total distance of the path
```

## Installation

```bash
npm install goroute
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dijkstra's algorithm implementation based on the original paper by Edsger W. Dijkstra
- Inspired by modern routing systems and graph theory applications 