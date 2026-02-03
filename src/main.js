import './style.css'

const API_URL = 'http://localhost:5000/api';

// State
let stations = [];
let connections = [];

// Line Colors Configuration
const LINE_COLORS = {
  'Red': '#ef4444',
  'Blue': '#3b82f6',
  'Green': '#22c55e',
  'Yellow': '#eab308',
  'Purple': '#a855f7',
  'Orange': '#f97316',
  'Pink': '#ec4899',
  'Default': '#94a3b8'
};

function getLineColor(lineName) {
  if (!lineName) return LINE_COLORS['Default'];
  // Try to match partial (e.g. "Red Line" -> "Red")
  const key = Object.keys(LINE_COLORS).find(k => lineName.includes(k));
  return key ? LINE_COLORS[key] : LINE_COLORS['Default'];
}

// Fetch Data & Initialize
async function initApp() {
  try {
    const res = await fetch(`${API_URL}/stations`);
    if (!res.ok) throw new Error('Failed to fetch stations');

    const data = await res.json();

    // Process data
    stations = data.map(s => ({
      id: s._id,
      name: s.name,
      x: s.x,
      y: s.y,
      type: s.isInterchange ? 'hub' : 'normal',
      lines: s.lines
    }));

    // Derive connections from lines
    connections = deriveConnections(data);

    renderMap();
    populateDropdowns();

  } catch (err) {
    console.error(err);
    // Fallback or Alert
    const startSelect = document.getElementById('start-station');
    startSelect.innerHTML = '<option disabled>Error loading data</option>';
  }
}

function deriveConnections(stationData) {
  const lines = {};
  const edges = [];

  // Group by line
  stationData.forEach(s => {
    s.lines.forEach(l => {
      if (!lines[l.line]) lines[l.line] = [];
      lines[l.line].push({ id: s._id, sequence: l.sequence });
    });
  });

  // Create edges
  Object.keys(lines).forEach(lineName => {
    lines[lineName].sort((a, b) => a.sequence - b.sequence);
    const color = getLineColor(lineName);

    for (let i = 0; i < lines[lineName].length - 1; i++) {
      edges.push({
        from: lines[lineName][i].id,
        to: lines[lineName][i + 1].id,
        color: color,
        line: lineName
      });
    }
  });

  return edges;
}

// UI Rendering
function renderMap() {
  const container = document.getElementById('map-container');
  container.innerHTML = '';

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("id", "metro-map");
  svg.setAttribute("viewBox", "0 0 800 600");
  svg.style.width = "100%";
  svg.style.height = "100%";

  // Draw connections
  const edgesGroup = document.createElementNS(svgNS, "g");
  connections.forEach((conn, index) => {
    const s1 = stations.find(s => s.id === conn.from);
    const s2 = stations.find(s => s.id === conn.to);

    if (!s1 || !s2) return;

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

    edgesGroup.appendChild(line);
  });
  svg.appendChild(edgesGroup);

  // Draw stations
  stations.forEach(s => {
    const group = document.createElementNS(svgNS, "g");
    group.setAttribute("class", "station-group");
    group.dataset.id = s.id;

    // Pulse
    const pulse = document.createElementNS(svgNS, "circle");
    pulse.setAttribute("cx", s.x);
    pulse.setAttribute("cy", s.y);
    pulse.setAttribute("r", "8");
    pulse.setAttribute("fill", "var(--primary)");
    pulse.setAttribute("class", "pulse-circle");
    pulse.style.opacity = "0";

    // Node
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", s.x);
    circle.setAttribute("cy", s.y);
    circle.setAttribute("r", s.type === 'hub' ? "14" : "10");
    circle.setAttribute("class", "station-node");
    circle.dataset.id = s.id;

    // Label
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", s.x);
    text.setAttribute("y", s.y - 25);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "var(--text-main)");
    text.setAttribute("font-size", "12px");
    text.textContent = s.name;
    text.style.pointerEvents = "none";

    group.appendChild(pulse);
    group.appendChild(circle);
    group.appendChild(text);

    group.addEventListener('click', () => handleStationClick(s.id));
    svg.appendChild(group);
  });

  container.appendChild(svg);
}

// Logic: Handle selection
let selectionState = 'start';

function handleStationClick(id) {
  const station = stations.find(s => s.id === id);
  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  // Using Names in select
  if (startSelect.value === '' || (startSelect.value !== '' && endSelect.value !== '')) {
    startSelect.value = station.name;
    endSelect.value = '';
    resetVisuals();
    highlightStation(id, 'start');
    selectionState = 'end';
  } else {
    if (startSelect.value === station.name) return;
    endSelect.value = station.name;
    highlightStation(id, 'end');
    selectionState = 'start';
    document.getElementById('find-route-btn').click();
  }
}

function highlightStation(id, type) {
  const nodes = document.querySelectorAll('.station-node');
  nodes.forEach(n => {
    if (n.dataset.id === id) {
      n.style.fill = type === 'start' ? 'var(--primary)' : 'var(--secondary)';
      n.style.stroke = 'white';
      n.setAttribute('r', '18');
    }
  });
}

function resetVisuals() {
  const nodes = document.querySelectorAll('.station-node');
  nodes.forEach(n => {
    const s = stations.find(st => st.id === n.dataset.id);
    n.style.fill = 'var(--bg-dark)';
    n.style.stroke = 'var(--text-main)';
    n.setAttribute('r', s.type === 'hub' ? "14" : "10");
  });

  const lines = document.querySelectorAll('.connection-line');
  lines.forEach(l => {
    l.style.opacity = '0.6';
    l.style.strokeWidth = '4';
    l.classList.remove('path-highlight');
    const from = l.dataset.from;
    const to = l.dataset.to;
    // Find connection color
    const conn = connections.find(c => (c.from === from && c.to === to) || (c.from === to && c.to === from));
    if (conn) l.setAttribute('stroke', conn.color);
  });

  document.getElementById('results-panel').style.display = 'none';
}

function visualizePath(pathNames) {
  // Convert path NAMES to IDs for visualization
  const pathIds = pathNames.map(name => {
    const s = stations.find(st => st.name === name);
    return s ? s.id : null;
  }).filter(id => id !== null);

  // Highlight Nodes
  pathIds.forEach(id => {
    const node = document.querySelector(`.station-node[data-id="${id}"]`);
    if (node) {
      node.style.fill = 'white';
      node.style.stroke = 'var(--accent)';
    }
  });

  // Highlight Edges
  for (let i = 0; i < pathIds.length - 1; i++) {
    const u = pathIds[i];
    const v = pathIds[i + 1];
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

// Populate Dropdowns
function populateDropdowns() {
  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  // Clear generic options if any (except first)
  while (startSelect.options.length > 1) startSelect.remove(1);
  while (endSelect.options.length > 1) endSelect.remove(1);

  stations.sort((a, b) => a.name.localeCompare(b.name)).forEach(s => {
    startSelect.add(new Option(s.name, s.name)); // Using Name 
    endSelect.add(new Option(s.name, s.name));
  });
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  // Handle dropdown changes to highlight
  startSelect.addEventListener('change', () => {
    const s = stations.find(st => st.name === startSelect.value);
    if (s) {
      resetVisuals(); // partially reset
      highlightStation(s.id, 'start');
      if (endSelect.value) {
        const e = stations.find(st => st.name === endSelect.value);
        if (e) highlightStation(e.id, 'end');
      }
    }
  });

  endSelect.addEventListener('change', () => {
    const s = stations.find(st => st.name === endSelect.value);
    if (s) highlightStation(s.id, 'end');
  });

  document.getElementById('find-route-btn').addEventListener('click', async () => {
    const startName = startSelect.value;
    const endName = endSelect.value;
    const priority = document.getElementById('search-type').value;

    if (!startName || !endName) return alert("Select stations");
    if (startName === endName) return alert("Select different stations");

    let endpoint = '/path/min-time';
    if (priority === 'stations') endpoint = '/path/min-stations';
    if (priority === 'cost') endpoint = '/path/min-distance';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: startName, to: endName })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error finding path');

      // Show result
      resetVisuals();
      const startS = stations.find(s => s.name === startName);
      const endS = stations.find(s => s.name === endName);
      if (startS) highlightStation(startS.id, 'start');
      if (endS) highlightStation(endS.id, 'end');

      document.getElementById('results-panel').style.display = 'block';
      setTimeout(() => {
        document.getElementById('results-panel').style.opacity = '1';
      }, 10);

      let resultValue = "";
      let label = "";

      if (priority === 'stations') {
        resultValue = data.stationsCount;
        label = "Count";
      } else if (priority === 'cost') { // min-distance
        resultValue = data.distance;
        label = "Distance";
      } else {
        resultValue = data.time + " min";
        label = "Time";
      }

      document.getElementById('total-time').textContent = resultValue;
      // Update label based on result type if we want, but UI hardcodes "Total Time". 
      // Better to update label
      document.querySelector('.result-stat span:first-child').textContent = label;

      document.getElementById('path-stations-count').textContent = data.path.length;
      document.getElementById('path-details').textContent = data.path.join(' → ');

      visualizePath(data.path);

    } catch (err) {
      alert(err.message);
    }
  });
});
