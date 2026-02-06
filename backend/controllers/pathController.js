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
// Dijkstra Algorithm with Line Transfer Penalty
const getShortestPathDijkstra = (start, end, adj, transferPenalty = 0) => {
    // Priority Queue to store { station, line, time }
    const pq = new PriorityQueue();

    // Distances map: Key = "StationName-LineName" -> Value = Time
    // We need to track the line we arrived on to calculate transfer costs
    const minDists = {};

    // Helper to generate key
    const getKey = (station, line) => line ? `${station}-${line}` : station;

    // Initialize with start station
    // We strictly assume starting at 'start' has 0 cost. 
    // We effectively haven't 'entered' a line yet, so line is null.
    pq.enqueue({ station: start, line: null }, 0);
    minDists[getKey(start, null)] = 0;

    const predecessors = {}; // Key: "Station-Line", Value: { station, line } (The node we came from)

    let finalState = null; // Store the end state { station: end, line: FinalLine } to backtrack

    while (!pq.isEmpty()) {
        const { val: current, priority: currentTime } = pq.dequeue();
        const { station: u, line: currentLine } = current;

        // Optimization: If we found a faster way to this specific state (Station + Line), skip
        if (currentTime > (minDists[getKey(u, currentLine)] || Infinity)) continue;

        // Check if we reached destination
        if (u === end) {
            // We found a path. Since it's a priority queue, this is the first time we hit 'end' 
            // with the shortest time for this specific path. 
            // Note: We might reach 'end' via Line A faster than Line B. 
            // Because we pop minimal total time, the first time we pop 'end' (any line) is the shortest overall.
            finalState = { station: u, line: currentLine };
            break;
        }

        if (adj[u]) {
            for (let neighbor of adj[u]) {
                const v = neighbor.node;
                const nextLine = neighbor.line;
                const weight = neighbor.weight;

                // Calculate Cost
                let newTime = currentTime + weight;

                // Add transfer penalty if we are switching lines
                // currentLine === null means we are starting, so no penalty
                if (currentLine !== null && currentLine !== nextLine) {
                    newTime += transferPenalty;
                }

                // Relaxation
                const vKey = getKey(v, nextLine);
                if (newTime < (minDists[vKey] || Infinity)) {
                    minDists[vKey] = newTime;
                    predecessors[vKey] = { station: u, line: currentLine };
                    pq.enqueue({ station: v, line: nextLine }, newTime);
                }
            }
        }
    }

    // Reconstruct Path
    if (!finalState) return { path: [], totalTime: -1 };

    const path = [];
    let currState = finalState;

    while (currState) {
        path.push(currState.station);
        const prev = predecessors[getKey(currState.station, currState.line)];
        currState = prev;
    }

    // Clean up path: Remove duplicates if any (though logic shouldn't produce adjacent duplicates acting as transitions)
    // The logic produces [End, ..., Start]. Reverse it.
    return { path: path.reverse(), totalTime: minDists[getKey(finalState.station, finalState.line)] };
};

const getMinTimePath = async (req, res) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) return res.status(400).json({ message: 'Please provide start and destination stations' });

        const stations = await Station.find({});
        const adj = buildWeightedGraph(stations);

        if (!adj[from] || !adj[to]) return res.status(404).json({ message: 'Invalid station names' });

        // Apply Transfer Penalty for Time (e.g., 5 minutes)
        const { path, totalTime } = getShortestPathDijkstra(from, to, adj, TIME_TRANSFER);

        if (totalTime === -1) {
            return res.status(404).json({ message: 'No path found' });
        }

        res.json({
            path,
            time: totalTime,
            message: "Shortest path based on minimum time (Intelligent Dijkstra with Transfers)"
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

const calculateFare = (distance) => {
    if (distance <= 2) return 5;
    if (distance <= 5) return 10;
    if (distance <= 10) return 15;
    if (distance <= 20) return 20;
    return 25;
};

const getMinCostPath = async (req, res) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) return res.status(400).json({ message: 'Please provide start and destination stations' });

        const stations = await Station.find({});
        const adj = buildDistanceGraph(stations);

        if (!adj[from] || !adj[to]) return res.status(404).json({ message: 'Invalid station names' });

        const { path, totalTime: totalDistance } = getShortestPathDijkstra(from, to, adj, 0);

        if (totalDistance === -1) {
            return res.status(404).json({ message: 'No path found' });
        }

        const cost = calculateFare(totalDistance);

        res.json({
            path,
            distance: totalDistance.toFixed(2) + " km",
            cost: cost,
            message: "Shortest path based on minimum cost (Fare calculated via distance)"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMinStationsPath,
    getMinTimePath,
    getMinCostPath
};
