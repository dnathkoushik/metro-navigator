import './style.css'
import { stations, connections } from './data.js'

// Graph Data Structure
const graph = new Map();

function initGraph() {
  stations.forEach(station => {
    graph.set(station.id, { ...station, neighbors: [] });
  });

  connections.forEach(conn => {
    const s1 = graph.get(conn.from);
    const s2 = graph.get(conn.to);

    if (s1 && s2) {
      s1.neighbors.push({ to: conn.to, weight: conn.weight, color: conn.color });
      s2.neighbors.push({ to: conn.from, weight: conn.weight, color: conn.color });
    }
  });
}

// Dijkstra Algorithm
function findShortestPath(startId, endId) {
  const distances = new Map();
  const previous = new Map();
  const queue = new Set(graph.keys());

  stations.forEach(s => distances.set(s.id, Infinity));
  distances.set(startId, 0);

  while (queue.size > 0) {
    let minNode = null;
    for (const node of queue) {
      if (minNode === null || distances.get(node) < distances.get(minNode)) {
        minNode = node;
      }
    }

    if (minNode === endId) break;
    if (distances.get(minNode) === Infinity) break;

    queue.delete(minNode);

    const neighbors = graph.get(minNode).neighbors;
    for (const neighbor of neighbors) {
      const alt = distances.get(minNode) + neighbor.weight;
      if (alt < distances.get(neighbor.to)) {
        distances.set(neighbor.to, alt);
        previous.set(neighbor.to, minNode);
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = endId;
  if (previous.has(endId) || startId === endId) {
    while (current) {
      path.unshift(current);
      current = previous.get(current);
    }
  }

  return { path, distance: distances.get(endId) };
}

// UI Rendering
function renderMap() {
  const container = document.getElementById('map-container');
  container.innerHTML = ''; // Clear existing

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("id", "metro-map");
  svg.setAttribute("viewBox", "0 0 800 600");
  svg.style.width = "100%";
  svg.style.height = "100%";

  // Draw connections (edges)
  const edgesGroup = document.createElementNS(svgNS, "g");
  connections.forEach((conn, index) => {
    const s1 = stations.find(s => s.id === conn.from);
    const s2 = stations.find(s => s.id === conn.to);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", s1.x);
    line.setAttribute("y1", s1.y);
    line.setAttribute("x2", s2.x);
    line.setAttribute("y2", s2.y);
    line.setAttribute("stroke", conn.color);
    line.setAttribute("stroke-width", "4");
    line.setAttribute("class", "connection-line");
    line.dataset.from = s1.id;
    line.dataset.to = s2.id;
    line.dataset.id = `conn-${index}`;

    // Add time label on line
    const midX = (s1.x + s2.x) / 2;
    const midY = (s1.y + s2.y) / 2;

    // Optional: Text for weight
    // const text = document.createElementNS(svgNS, "text");
    // text.setAttribute("x", midX);
    // text.setAttribute("y", midY);
    // text.textContent = conn.weight + "m";
    // svg.appendChild(text); // Would need grouping

    edgesGroup.appendChild(line);
  });
  svg.appendChild(edgesGroup);

  // Draw stations (nodes)
  stations.forEach(s => {
    const group = document.createElementNS(svgNS, "g");
    group.setAttribute("class", "station-group");
    group.style.cursor = "pointer";
    group.dataset.id = s.id;

    // Pulse effect circle (hidden by default)
    const pulse = document.createElementNS(svgNS, "circle");
    pulse.setAttribute("cx", s.x);
    pulse.setAttribute("cy", s.y);
    pulse.setAttribute("r", "8");
    pulse.setAttribute("fill", "var(--primary)");
    pulse.setAttribute("class", "pulse-circle");
    pulse.style.opacity = "0";

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", s.x);
    circle.setAttribute("cy", s.y);
    circle.setAttribute("r", s.type === 'hub' ? "12" : "8");
    circle.setAttribute("class", "station-node");
    circle.dataset.id = s.id;

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", s.x);
    text.setAttribute("y", s.y - 20);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "var(--text-main)");
    text.setAttribute("font-size", "12px");
    text.setAttribute("font-weight", "500");
    text.style.pointerEvents = "none";
    text.textContent = s.name;

    group.appendChild(pulse);
    group.appendChild(circle);
    group.appendChild(text);

    // Click handler to select stations
    group.addEventListener('click', () => handleStationClick(s.id));

    svg.appendChild(group);
  });

  container.appendChild(svg);
}

// Logic: Handle selection
let selectionState = 'start'; // 'start' or 'end'

function handleStationClick(id) {
  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  // Simple toggle logic or specific selection
  if (startSelect.value === '' || (startSelect.value !== '' && endSelect.value !== '')) {
    // If start is empty, or both are full (resetting), set start
    startSelect.value = id;
    endSelect.value = '';
    resetVisuals();
    highlightStation(id, 'start');
    selectionState = 'end';
  } else {
    // Set end
    if (startSelect.value === id) return; // Cannot be same
    endSelect.value = id;
    highlightStation(id, 'end');
    selectionState = 'start';
    // Auto find route?
    document.getElementById('find-route-btn').click();
  }
}

function highlightStation(id, type) {
  const nodes = document.querySelectorAll('.station-node');
  nodes.forEach(n => {
    if (n.dataset.id === id) {
      n.style.fill = type === 'start' ? 'var(--primary)' : 'var(--secondary)';
      n.style.stroke = 'white';
      n.setAttribute('r', '14');
    }
  });
}

function resetVisuals() {
  const nodes = document.querySelectorAll('.station-node');
  nodes.forEach(n => {
    const s = stations.find(st => st.id === n.dataset.id);
    n.style.fill = 'var(--bg-dark)';
    n.style.stroke = 'var(--text-main)';
    n.setAttribute('r', s.type === 'hub' ? "12" : "8");
  });

  const lines = document.querySelectorAll('.connection-line');
  lines.forEach(l => {
    l.style.opacity = '0.6';
    l.style.strokeWidth = '4';
    l.classList.remove('path-highlight');
    // Reset color
    const from = l.dataset.from;
    const to = l.dataset.to;
    const conn = connections.find(c => (c.from === from && c.to === to) || (c.from === to && c.to === from));
    if (conn) l.setAttribute('stroke', conn.color);
  });

  document.getElementById('results-panel').style.display = 'none';
}

function visualizePath(path) {
  // Highlight Nodes
  path.forEach(id => {
    const node = document.querySelector(`.station-node[data-id="${id}"]`);
    if (node) {
      node.style.fill = 'white';
      node.style.stroke = 'var(--accent)';
    }
  });

  // Highlight Edges
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    // Find line
    const line = document.querySelector(`.connection-line[data-from="${u}"][data-to="${v}"]`) ||
      document.querySelector(`.connection-line[data-from="${v}"][data-to="${u}"]`);

    if (line) {
      line.style.opacity = '1';
      line.style.strokeWidth = '6';
      line.setAttribute('stroke', 'var(--accent)');
      line.classList.add('path-highlight');
    }
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initGraph();
  renderMap();

  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  stations.forEach(s => {
    const opt1 = new Option(s.name, s.id);
    const opt2 = new Option(s.name, s.id);
    startSelect.add(opt1);
    endSelect.add(opt2);
  });

  document.getElementById('find-route-btn').addEventListener('click', () => {
    const start = startSelect.value;
    const end = endSelect.value;

    if (!start || !end) {
      alert("Please select both stations");
      return;
    }
    if (start === end) {
      alert("Start and Destination cannot be the same");
      return;
    }

    resetVisuals();
    highlightStation(start, 'start');
    highlightStation(end, 'end');

    const result = findShortestPath(start, end);

    if (result.distance === Infinity) {
      alert("No path found!");
    } else {
      // Show result
      document.getElementById('results-panel').style.display = 'block';
      setTimeout(() => {
        document.getElementById('results-panel').style.opacity = '1';
      }, 10);

      document.getElementById('total-time').textContent = result.distance + " mins";
      document.getElementById('path-stations-count').textContent = result.path.length;
      document.getElementById('path-details').textContent = result.path.map(id => stations.find(s => s.id === id).name).join(' → ');

      visualizePath(result.path);
    }
  });
});
