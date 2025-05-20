#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <limits>
#include <cmath>

class DijkstraRouter {
private:
    struct Edge {
        int to;
        double weight;
        Edge(int t, double w) : to(t), weight(w) {}
    };

    struct Node {
        std::vector<Edge> edges;
    };

    std::vector<Node> graph;
    int numNodes;

public:
    DijkstraRouter(int nodes) : numNodes(nodes) {
        graph.resize(nodes);
    }

    void addEdge(int from, int to, double weight) {
        graph[from].edges.emplace_back(to, weight);
        graph[to].edges.emplace_back(from, weight); // For undirected graph
    }

    std::pair<std::vector<int>, double> findShortestPath(int start, int end) {
        std::vector<double> distances(numNodes, std::numeric_limits<double>::infinity());
        std::vector<int> previous(numNodes, -1);
        std::priority_queue<std::pair<double, int>, 
                          std::vector<std::pair<double, int>>, 
                          std::greater<std::pair<double, int>>> pq;

        distances[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            int current = pq.top().second;
            double currentDist = pq.top().first;
            pq.pop();

            if (current == end) break;
            if (currentDist > distances[current]) continue;

            for (const Edge& edge : graph[current].edges) {
                double newDist = distances[current] + edge.weight;
                if (newDist < distances[edge.to]) {
                    distances[edge.to] = newDist;
                    previous[edge.to] = current;
                    pq.push({newDist, edge.to});
                }
            }
        }

        // Reconstruct path
        std::vector<int> path;
        if (distances[end] != std::numeric_limits<double>::infinity()) {
            for (int current = end; current != -1; current = previous[current]) {
                path.push_back(current);
            }
            std::reverse(path.begin(), path.end());
        }

        return {path, distances[end]};
    }

    void buildGraphFromCoordinates(const std::vector<std::pair<double, double>>& coordinates,
                                 const std::vector<std::pair<int, int>>& connections) {
        // Clear existing graph
        graph.clear();
        graph.resize(coordinates.size());
        numNodes = coordinates.size();

        // Add edges based on connections
        for (const auto& connection : connections) {
            int from = connection.first;
            int to = connection.second;
            double weight = calculateDistance(coordinates[from], coordinates[to]);
            addEdge(from, to, weight);
        }
    }

private:
    double calculateDistance(const std::pair<double, double>& p1, 
                           const std::pair<double, double>& p2) {
        double dx = p2.first - p1.first;
        double dy = p2.second - p1.second;
        return std::sqrt(dx * dx + dy * dy);
    }
}; 