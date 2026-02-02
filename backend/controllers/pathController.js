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

const findPath = async (req, res) => {
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

module.exports = {
    findPath
};
