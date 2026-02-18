import './style.css'

const API_URL = 'http://localhost:5000/api';

// ─── State ────────────────────────────────────────────────────────────────────
let stations = [];
let connections = [];
let selectedCity = null;   // { name, slug, state, ... }
let token = localStorage.getItem('metro-token');

// ─── Line Colors ──────────────────────────────────────────────────────────────
const LINE_COLORS = {
  'Red': '#ef4444',
  'Blue': '#3b82f6',
  'Green': '#22c55e',
  'Yellow': '#eab308',
  'Purple': '#a855f7',
  'Orange': '#f97316',
  'Pink': '#ec4899',
  'Line 1': '#6366f1',
  'Line 2A': '#22d3ee',
  'Line 7': '#f97316',
  'Default': '#94a3b8'
};

function getLineColor(lineName) {
  if (!lineName) return LINE_COLORS['Default'];
  const key = Object.keys(LINE_COLORS).find(k => lineName.includes(k));
  return key ? LINE_COLORS[key] : LINE_COLORS['Default'];
}

// ─── City Emoji Map ───────────────────────────────────────────────────────────
const CITY_EMOJIS = {
  kolkata: '🏙️',
  delhi: '🕌',
  mumbai: '🌊',
  bangalore: '💻',
  chennai: '🏛️',
  hyderabad: '💎'
};

const CITY_GRADIENTS = {
  kolkata: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  delhi: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  mumbai: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  bangalore: 'linear-gradient(135deg, #22c55e, #16a34a)',
  chennai: 'linear-gradient(135deg, #f97316, #ef4444)',
  hyderabad: 'linear-gradient(135deg, #ec4899, #a855f7)'
};

// ─── DOM Elements ─────────────────────────────────────────────────────────────
const authContainer = document.getElementById('auth-container');
const citySelection = document.getElementById('city-selection');
const mainApp = document.getElementById('main-app');
const logoutBtn = document.getElementById('logout-btn');
const changeCityBtn = document.getElementById('change-city-btn');
const cityBadge = document.getElementById('city-badge');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginContainer = document.getElementById('login-form-container');
const registerContainer = document.getElementById('register-form-container');

// ─── Auth Functions ───────────────────────────────────────────────────────────
function checkAuth() {
  if (token) {
    showCitySelection();
  } else {
    showAuth();
  }
}

function showAuth() {
  authContainer.style.display = 'flex';
  citySelection.style.display = 'none';
  mainApp.style.display = 'none';
  logoutBtn.style.display = 'none';
  changeCityBtn.style.display = 'none';
  cityBadge.style.display = 'none';
  loginContainer.style.display = 'block';
  registerContainer.style.display = 'none';
}

function showCitySelection() {
  authContainer.style.display = 'none';
  citySelection.style.display = 'flex';
  mainApp.style.display = 'none';
  logoutBtn.style.display = 'block';
  changeCityBtn.style.display = 'none';
  cityBadge.style.display = 'none';
  loadCities();
}

function showApp() {
  authContainer.style.display = 'none';
  citySelection.style.display = 'none';
  mainApp.style.display = 'grid';
  logoutBtn.style.display = 'block';
  changeCityBtn.style.display = 'block';
  cityBadge.style.display = 'inline-block';
  cityBadge.textContent = `${CITY_EMOJIS[selectedCity.slug] || '🚇'} ${selectedCity.name}`;

  // Reset and load
  stations = [];
  connections = [];
  initApp();
}

function logout() {
  localStorage.removeItem('metro-token');
  token = null;
  selectedCity = null;
  location.reload();
}

// ─── City Selection ───────────────────────────────────────────────────────────
let allCities = [];

async function loadCities() {
  const grid = document.getElementById('cities-grid');
  grid.innerHTML = `
    <div class="city-loading">
      <div class="loading-spinner"></div>
      <p>Loading cities...</p>
    </div>`;

  try {
    const res = await fetch(`${API_URL}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    allCities = await res.json();
    renderCityCards(allCities);
  } catch (err) {
    grid.innerHTML = `<div class="no-cities">
      <p style="font-size:2rem">⚠️</p>
      <p style="margin-top:0.5rem">Could not load cities. Make sure the backend is running.</p>
    </div>`;
  }
}

function renderCityCards(cities) {
  const grid = document.getElementById('cities-grid');

  if (cities.length === 0) {
    grid.innerHTML = `<div class="no-cities">
      <p style="font-size:2rem">🔍</p>
      <p style="margin-top:0.5rem">No cities found</p>
    </div>`;
    return;
  }

  grid.innerHTML = cities.map((city, i) => {
    const emoji = CITY_EMOJIS[city.slug] || '🚇';
    const gradient = CITY_GRADIENTS[city.slug] || 'linear-gradient(135deg, var(--primary), var(--secondary))';
    return `
    <div class="city-card" data-slug="${city.slug}" style="animation-delay: ${i * 0.07}s">
      <div class="city-card-header">
        <div class="city-icon" style="background: ${gradient}">
          ${emoji}
        </div>
        <div class="city-status">
          <div class="status-dot"></div>
          Active
        </div>
      </div>
      <div class="city-name">${city.name}</div>
      <div class="city-state">${city.state}</div>
      <div class="city-description">${city.description || 'Explore the metro network of this city.'}</div>
      <div class="city-stats">
        <div class="city-stat">
          <div class="city-stat-value">${city.totalLines || '—'}</div>
          <div class="city-stat-label">Lines</div>
        </div>
        <div class="city-stat">
          <div class="city-stat-value">${city.totalStations || '—'}</div>
          <div class="city-stat-label">Stations</div>
        </div>
      </div>
      <div class="city-card-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>`;
  }).join('');

  // Attach click listeners
  grid.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      const city = allCities.find(c => c.slug === slug);
      if (city) selectCity(city);
    });
  });
}

function selectCity(city) {
  selectedCity = city;
  showApp();
}

// ─── Search Filter ────────────────────────────────────────────────────────────
document.getElementById('city-search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = allCities.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q)
  );
  renderCityCards(filtered);
});

// ─── Metro App Init ───────────────────────────────────────────────────────────
async function initApp() {
  try {
    const res = await fetch(`${API_URL}/cities/${selectedCity.slug}/stations`);
    if (!res.ok) throw new Error('Failed to fetch stations');

    const data = await res.json();

    stations = data.map(s => ({
      id: s._id,
      name: s.name,
      x: s.x,
      y: s.y,
      type: s.isInterchange ? 'hub' : 'normal',
      lines: s.lines
    }));

    connections = deriveConnections(data);

    renderMap();
    populateDropdowns();
    renderLineLegend();

  } catch (err) {
    console.error(err);
    const startSelect = document.getElementById('start-station');
    if (startSelect) {
      startSelect.innerHTML = '<option disabled>Error loading data</option>';
    }
  }
}

function deriveConnections(stationData) {
  const lines = {};
  const edges = [];

  stationData.forEach(s => {
    s.lines.forEach(l => {
      if (!lines[l.line]) lines[l.line] = [];
      lines[l.line].push({ id: s._id, sequence: l.sequence });
    });
  });

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

// ─── Map Rendering ────────────────────────────────────────────────────────────
function renderMap() {
  const container = document.getElementById('map-container');
  container.innerHTML = '';

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("id", "metro-map");
  svg.setAttribute("viewBox", "0 0 1500 1600");
  svg.style.width = "100%";
  svg.style.height = "100%";

  // Draw connections
  const edgesGroup = document.createElementNS(svgNS, "g");
  connections.forEach(conn => {
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
    circle.setAttribute("r", s.type === 'hub' ? "14" : "10");
    circle.setAttribute("class", "station-node");
    circle.dataset.id = s.id;

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", s.x);
    text.setAttribute("y", s.y - 18);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "var(--text-main)");
    text.setAttribute("font-size", "11px");
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

function renderLineLegend() {
  // Get unique lines
  const lineSet = new Set();
  connections.forEach(c => lineSet.add(c.line));

  const panel = document.querySelector('.controls-panel');
  const existing = panel.querySelector('.line-legend-wrapper');
  if (existing) existing.remove();

  const wrapper = document.createElement('div');
  wrapper.className = 'line-legend-wrapper';
  wrapper.innerHTML = `
    <div style="font-size:0.8rem; color:var(--text-muted); font-weight:500; margin-bottom:0.5rem;">METRO LINES</div>
    <div class="line-legend">
      ${[...lineSet].map(line => `
        <div class="legend-item">
          <div class="legend-dot" style="background:${getLineColor(line)}"></div>
          <span>${line}</span>
        </div>`).join('')}
    </div>`;
  panel.appendChild(wrapper);
}

// ─── Station Selection Logic ──────────────────────────────────────────────────
let selectionState = 'start';

function handleStationClick(id) {
  const station = stations.find(s => s.id === id);
  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

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
    const conn = connections.find(c => (c.from === from && c.to === to) || (c.from === to && c.to === from));
    if (conn) l.setAttribute('stroke', conn.color);
  });

  document.getElementById('results-panel').style.display = 'none';
}

function visualizePath(pathNames) {
  const pathIds = pathNames.map(name => {
    const s = stations.find(st => st.name === name);
    return s ? s.id : null;
  }).filter(id => id !== null);

  pathIds.forEach(id => {
    const node = document.querySelector(`.station-node[data-id="${id}"]`);
    if (node) {
      node.style.fill = 'white';
      node.style.stroke = 'var(--accent)';
    }
  });

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

// ─── Dropdowns ────────────────────────────────────────────────────────────────
function populateDropdowns() {
  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  while (startSelect.options.length > 1) startSelect.remove(1);
  while (endSelect.options.length > 1) endSelect.remove(1);

  stations.sort((a, b) => a.name.localeCompare(b.name)).forEach(s => {
    startSelect.add(new Option(s.name, s.name));
    endSelect.add(new Option(s.name, s.name));
  });
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Auth toggles
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      token = data.token;
      localStorage.setItem('metro-token', token);
      showCitySelection();
    } catch (err) {
      alert(err.message);
    }
  });

  // Register
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      token = data.token;
      localStorage.setItem('metro-token', token);
      showCitySelection();
    } catch (err) {
      alert(err.message);
    }
  });

  logoutBtn.addEventListener('click', logout);

  // Change city
  changeCityBtn.addEventListener('click', () => {
    selectedCity = null;
    stations = [];
    connections = [];
    showCitySelection();
  });

  // Dropdown changes
  const startSelect = document.getElementById('start-station');
  const endSelect = document.getElementById('end-station');

  startSelect.addEventListener('change', () => {
    const s = stations.find(st => st.name === startSelect.value);
    if (s) {
      resetVisuals();
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

  // Find Route
  document.getElementById('find-route-btn').addEventListener('click', async () => {
    const startName = startSelect.value;
    const endName = endSelect.value;
    const priority = document.getElementById('search-type').value;

    if (!startName || !endName) return alert("Select stations");
    if (startName === endName) return alert("Select different stations");

    let endpoint = '/path/min-time';
    if (priority === 'stations') endpoint = '/path/min-stations';
    if (priority === 'cost') endpoint = '/path/min-cost';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          from: startName,
          to: endName,
          citySlug: selectedCity ? selectedCity.slug : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error finding path');

      resetVisuals();
      const startS = stations.find(s => s.name === startName);
      const endS = stations.find(s => s.name === endName);
      if (startS) highlightStation(startS.id, 'start');
      if (endS) highlightStation(endS.id, 'end');

      document.getElementById('results-panel').style.display = 'block';

      let resultValue = "";
      let label = "";

      if (priority === 'stations') {
        resultValue = data.stationsCount;
        label = "Count";
      } else if (priority === 'cost') {
        resultValue = '₹' + data.cost;
        label = "Cost";
      } else {
        resultValue = data.time + " min";
        label = "Time";
      }

      document.getElementById('total-time').textContent = resultValue;
      document.querySelector('.result-stat span:first-child').textContent = label;
      document.getElementById('path-stations-count').textContent = data.path.length;
      document.getElementById('path-details').textContent = data.path.join(' → ');

      visualizePath(data.path);

    } catch (err) {
      alert(err.message);
    }
  });
});
