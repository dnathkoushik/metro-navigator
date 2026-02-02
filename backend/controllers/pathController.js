const Station = require('../models/Station');

// Helper to build graph from stations
const buildGraph = (stations) => {
    const adj = {};

    // Initialize adjacency list for all stations
    stations.forEach(station => {
        adj[station.name] = [];
    });

    // Group stations by line to find neighbors
    const lines = {};
    stations.forEach(station => {
        station.lines.forEach(lineData => {
            if (!lines[lineData.line]) {
                lines[lineData.line] = [];
            }
            lines[lineData.line].push({
                name: station.name,
                sequence: lineData.sequence
            });
        });
    });

    // Add edges based on sequence in lines
    Object.keys(lines).forEach(lineName => {
        // Sort by sequence to ensure correct order
        lines[lineName].sort((a, b) => a.sequence - b.sequence);

        // Connect adjacent stations
        for (let i = 0; i < lines[lineName].length - 1; i++) {
            const u = lines[lineName][i].name;
            const v = lines[lineName][i + 1].name;

            // Add undirected edge if not already present
            if (!adj[u].includes(v)) adj[u].push(v);
            if (!adj[v].includes(u)) adj[v].push(u);
        }
    });

    return adj;
};

// BFS to find shortest path (min stations)
// Equivalent to the C++ BFS implementation provided
const getShortestPathBFS = (start, end, adj) => {
    const queue = [start];
    const visited = new Set();
    const predecessors = {}; // Equivalent to vector<int> pred

    visited.add(start);
    predecessors[start] = null;

    while (queue.length > 0) {
        const u = queue.shift(); // queue.pop() in C++ BFS usually refers to front for queue, but in C++ std::queue, pop is void and front gets elem. Array.shift() is dequeue.

        if (u === end) {
            break; // Stop BFS when destination is found
        }

        if (adj[u]) {
            for (const v of adj[u]) {
                if (!visited.has(v)) {
                    visited.add(v);
                    predecessors[v] = u;
                    queue.push(v);
                }
            }
        }
    }

    // Reconstruct path from src to dest
    const path = [];
    if (!visited.has(end)) {
        return null; // No path found
    }

    // Backtrack from destination to source
    let curr = end;
    while (curr !== null) {
        path.push(curr);
        curr = predecessors[curr];
    }

    return path.reverse(); // Reverse to get [src, ..., dest]
};

const getMinStationsPath = async (req, res) => {
    try {
        const { from, to } = req.body;

        if (!from || !to) {
            return res.status(400).json({ message: 'Please provide start and destination stations' });
        }

        const stations = await Station.find({});
        const adj = buildGraph(stations); // Build adjacency list

        // Check if stations exist in the graph
        if (!adj[from] || !adj[to]) {
            return res.status(404).json({ message: 'Invalid station names' });
        }

        const path = getShortestPathBFS(from, to, adj);

        if (!path) {
            return res.status(404).json({ message: 'No path found between these stations' });
        }

        res.json({
            path,
            stationsCount: path.length,
            message: "Shortest path based on minimum stations (BFS)"
        });

    } catch (error) {
        console.error('Error finding path:', error);
        res.status(500).json({ message: 'Server error processing path request' });
    }
};

// Priority Queue for Dijkstra
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    dequeue() {
        return this.values.shift();
    }
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
    isEmpty() {
        return this.values.length === 0;
    }
}

// Constants for Time
// You can adjust these values
const TIME_PER_STATION = 2; // mins
const TIME_TRANSFER = 5;    // mins

// Build weighted graph for Dijkstra
// Returns adj: { startNode: [ { node: neighbor, weight: time, line: lineName } ] }
const buildWeightedGraph = (stations) => {
    const adj = {};

    // Initialize
    stations.forEach(s => {
        adj[s.name] = [];
    });

    const lines = {};
    stations.forEach(station => {
        station.lines.forEach(l => {
            if (!lines[l.line]) lines[l.line] = [];
            lines[l.line].push({ name: station.name, sequence: l.sequence });
        });
    });

    // Add edges
    Object.keys(lines).forEach(lineName => {
        lines[lineName].sort((a, b) => a.sequence - b.sequence);
        for (let i = 0; i < lines[lineName].length - 1; i++) {
            const u = lines[lineName][i].name;
            const v = lines[lineName][i + 1].name;

            // Standard edge weight
            const weight = TIME_PER_STATION;

            // Add undirected edge
            adj[u].push({ node: v, weight, line: lineName });
            adj[v].push({ node: u, weight, line: lineName });
        }
    });
    return adj;
};

// Dijkstra Algorithm for Minimum Time
const getShortestPathDijkstra = (start, end, adj) => {
    const pq = new PriorityQueue();
    const distances = {};
    const previous = {};

    // Initialize
    for (let currentVertex in adj) {
        if (currentVertex === start) {
            distances[currentVertex] = 0;
            pq.enqueue({ station: currentVertex, line: null }, 0);
        } else {
            distances[currentVertex] = Infinity;
        } // We don't need to enqueue infinite nodes immediately for optimization, or we can. 
        // Standard lazy Dijkstra: just push start.
        previous[currentVertex] = null;
    }

    // We need to store { station, line } in the queue to track transfers
    // However, the standard `dist` array usually just tracks min cost to a node.
    // If we want to penalize transfers, the state needs to include the arrival line.
    // Let's stick to the simple node-based Dijkstra first as requested, 
    // but we can add transfer penalty if the line changes between edges.

    // Refined State for Queue: { station, arrivalLine }
    // Refined Distances: We might need dist[station] but since transfer depends on arrival line,
    // sophisticated Dijkstra often splits nodes: (Station, Line). 
    // BUT for simplicity matching the user's snippet which acts on 'adj[u]', 
    // let's try to infer transfer cost dynamically or keep it simple.

    // To properly support Transfer Costs in a simple Dijkstra on Stations:
    // We can't strictly do it without node splitting or keeping state. 
    // Let's implement a modified Dijkstra where `dist` map keys are complex: "StationName" 
    // (This is a simplification. If `u` is reached from Line A, going to Line B adds cost).

    // Let's do the standard Dijkstra on nodes first, assuming we calculate weight properly.
    // Issue: Standard Dijkstra on simple graph doesn't know "previous line".
    // Solution: The Graph State should be (Station, Line).

    // Let's use a Map for distances where key = `${station}-${line}`
    const minDists = {}; // Key: "StationName-LineName" -> Time

    pq.values = []; // Clear if generic
    // Start: We can start on "any" line or a "null" line. 
    // Since we are at start station, we haven't entered a line yet.
    // Neighbors will determine the line.

    // Let's stick to the User's C++ structure:
    // pair<vector<int>, int> Graph::Dijkstra(int src, int dest)
    // The user's snippet DOES NOT handle line transfers explicitly in the state.
    // It just uses `dist[v] = dist[u] + weight`.
    // So I will implement exactly that first (Standard Node Dijkstra).
    // If we need transfer weights, we will simple add them if we can detect.

    // *Simplified Implementation fitting the request*
    const dist = {};
    const pred = {};
    const INF = Infinity;

    for (const key in adj) {
        dist[key] = INF;
        pred[key] = null;
    }

    dist[start] = 0;

    // Re-init PQ for this specific logic
    const pqSimple = new PriorityQueue();
    pqSimple.enqueue(start, 0);

    while (!pqSimple.isEmpty()) {
        const { val: u, priority: currentDist } = pqSimple.dequeue();

        if (currentDist > dist[u]) continue;
        if (u === end) break;

        if (adj[u]) {
            for (let neighbor of adj[u]) {
                const v = neighbor.node;
                // Basic weight provided by graph
                let weight = neighbor.weight;

                // IMPORTANT: To add transfer penalty, we need to know how we got to 'u'.
                // The 'pred' array only stores the node name. 
                // We'll peek at pred[u] to see the line, but that's expensive.
                // For now, let's strictly follow the provided C++ logic (Simple Weighted Dijkstra).

                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pred[v] = u;
                    pqSimple.enqueue(v, dist[v]);
                }
            }
        }
    }

    // Reconstruct
    const path = [];
    if (dist[end] === INF) return { path: [], totalTime: -1 };

    let curr = end;
    while (curr !== null) {
        path.push(curr);
        curr = pred[curr];
    }

    return { path: path.reverse(), totalTime: dist[end] };
};

const getMinTimePath = async (req, res) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) return res.status(400).json({ message: 'Please provide start and destination stations' });

        const stations = await Station.find({});
        const adj = buildWeightedGraph(stations);

        if (!adj[from] || !adj[to]) return res.status(404).json({ message: 'Invalid station names' });

        const { path, totalTime } = getShortestPathDijkstra(from, to, adj);

        if (totalTime === -1) {
            return res.status(404).json({ message: 'No path found' });
        }

        res.json({
            path,
            time: totalTime,
            message: "Shortest path based on minimum time (Dijkstra)"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const DISTANCE_PER_STATION = 1.5; // km (approx average)

// Build graph specifically for Distance
const buildDistanceGraph = (stations) => {
    const adj = {};

    stations.forEach(s => {
        adj[s.name] = [];
    });

    const lines = {};
    stations.forEach(station => {
        station.lines.forEach(l => {
            if (!lines[l.line]) lines[l.line] = [];
            lines[l.line].push({ name: station.name, sequence: l.sequence });
        });
    });

    Object.keys(lines).forEach(lineName => {
        lines[lineName].sort((a, b) => a.sequence - b.sequence);
        for (let i = 0; i < lines[lineName].length - 1; i++) {
            const u = lines[lineName][i].name;
            const v = lines[lineName][i + 1].name;

            // Weight is distance
            const weight = DISTANCE_PER_STATION;

            adj[u].push({ node: v, weight, line: lineName });
            adj[v].push({ node: u, weight, line: lineName });
        }
    });
    return adj;
};

const getMinDistancePath = async (req, res) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) return res.status(400).json({ message: 'Please provide start and destination stations' });

        const stations = await Station.find({});
        const adj = buildDistanceGraph(stations);

        if (!adj[from] || !adj[to]) return res.status(404).json({ message: 'Invalid station names' });

        const { path, totalTime: totalDistance } = getShortestPathDijkstra(from, to, adj);

        if (totalDistance === -1) {
            return res.status(404).json({ message: 'No path found' });
        }

        res.json({
            path,
            distance: totalDistance + " km",
            message: "Shortest path based on minimum distance (Dijkstra)"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMinStationsPath,
    getMinTimePath,
    getMinDistancePath
};
