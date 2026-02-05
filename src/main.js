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

// Auth State
let token = localStorage.getItem('metro-token');

// Auth DOM Elements
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginContainer = document.getElementById('login-form-container');
const registerContainer = document.getElementById('register-form-container');

// Auth Functions
function checkAuth() {
  if (token) {
    showApp();
  } else {
    showAuth();
  }
}

function showApp() {
  authContainer.style.display = 'none';
  mainApp.style.display = 'grid';
  logoutBtn.style.display = 'block';
  // Only init app if stations are empty (first load after login)
  if (stations.length === 0) {
    initApp();
  }
}

function showAuth() {
  authContainer.style.display = 'flex';
  mainApp.style.display = 'none';
  logoutBtn.style.display = 'none';
  loginContainer.style.display = 'block';
  registerContainer.style.display = 'none';
}

function logout() {
  localStorage.removeItem('metro-token');
  token = null;
  location.reload();
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
    if (startSelect) {
      startSelect.innerHTML = '<option disabled>Error loading data</option>';
    }
  }
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Auth Listeners
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
      showApp();
    } catch (err) {
      alert(err.message);
    }
  });

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
      showApp();
    } catch (err) {
      alert(err.message);
    }
  });

  logoutBtn.addEventListener('click', logout);


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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
