#ifndef DIJKSTRA_ROUTER_H
#define DIJKSTRA_ROUTER_H

#include <vector>
#include <utility>

class DijkstraRouter {
private:
    struct Edge {
        int to;
        double weight;
        Edge(int t, double w);
    };

    struct Node {
        std::vector<Edge> edges;
    };

    std::vector<Node> graph;
    int numNodes;
    double calculateDistance(const std::pair<double, double>& p1, 
                           const std::pair<double, double>& p2);

public:
    DijkstraRouter(int nodes);
    void addEdge(int from, int to, double weight);
    std::pair<std::vector<int>, double> findShortestPath(int start, int end);
    void buildGraphFromCoordinates(const std::vector<std::pair<double, double>>& coordinates,
                                 const std::vector<std::pair<int, int>>& connections);
};

#endif // DIJKSTRA_ROUTER_H 