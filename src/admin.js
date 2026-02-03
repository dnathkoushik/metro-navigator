const API_URL = 'http://localhost:5000/api';

// Selectors
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const addStationForm = document.getElementById('add-station-form');
const blockUserForm = document.getElementById('block-user-form');
const stationsList = document.getElementById('stations-list');

// State
let token = localStorage.getItem('adminToken');

// Init
function init() {
    if (token) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    fetchStations();
}

// Auth Logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        // Verify Admin
        // For now we assume the returned token is enough, but ideally we check role
        // We can decode jwt or simple check if api allows admin actions
        // But let's check profile first to be sure
        const profileRes = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const profile = await profileRes.json();

        if (profile.type !== 'admin') {
            throw new Error('Not authorized as Admin');
        }

        token = data.token;
        localStorage.setItem('adminToken', token);
        showDashboard();
    } catch (err) {
        alert(err.message);
    }
});

logoutBtn.addEventListener('click', () => {
    token = null;
    localStorage.removeItem('adminToken');
    showLogin();
});

// Station Management
async function fetchStations() {
    try {
        const res = await fetch(`${API_URL}/stations`);
        const data = await res.json();
        renderStations(data);
    } catch (err) {
        console.error(err);
        stationsList.innerHTML = '<p style="color: red">Failed to load stations</p>';
    }
}

function renderStations(stations) {
    stationsList.innerHTML = '';
    stations.forEach(station => {
        const div = document.createElement('div');
        div.className = 'station-item';
        div.innerHTML = `
      <div>
        <strong style="color: var(--text-main)">${station.name}</strong>
        <div style="font-size: 0.8rem; color: var(--text-muted)">
            Lines: ${station.lines.map(l => l.line).join(', ')}
        </div>
      </div>
      <button class="btn-danger" data-id="${station._id}">Delete</button>
    `;
        stationsList.appendChild(div);
    });

    // Attach delete handlers
    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => deleteStation(e.target.dataset.id));
    });
}

// Add Station
addStationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('station-name').value;
    const linesRaw = document.getElementById('station-lines').value;
    const x = Number(document.getElementById('station-x').value);
    const y = Number(document.getElementById('station-y').value);
    const isInterchange = document.getElementById('is-interchange').checked;

    try {
        let lines;
        try {
            lines = JSON.parse(linesRaw);
        } catch {
            throw new Error('Invalid JSON format for lines');
        }

        const res = await fetch(`${API_URL}/admin/stations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, lines, isInterchange, x, y })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        alert('Station added successfully');
        addStationForm.reset();
        fetchStations(); // Refresh list
    } catch (err) {
        alert(err.message);
    }
});

// Delete Station
async function deleteStation(id) {
    if (!confirm('Are you sure you want to delete this station?')) return;

    try {
        const res = await fetch(`${API_URL}/admin/stations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message);
        }

        fetchStations();
    } catch (err) {
        alert(err.message);
    }
}

// Block User
blockUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('user-id').value;

    try {
        const res = await fetch(`${API_URL}/admin/users/${userId}/block`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        alert(data.message);
        blockUserForm.reset();
    } catch (err) {
        alert(err.message);
    }
});

// Initialize
init();
