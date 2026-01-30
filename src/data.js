export const stations = [
  { id: 'S1', name: 'Central Plaza', x: 400, y: 300, type: 'hub' },
  { id: 'S2', name: 'Tech District', x: 200, y: 450, type: 'normal' },
  { id: 'S3', name: 'Old Market', x: 600, y: 450, type: 'normal' },
  { id: 'S4', name: 'North Gate', x: 400, y: 100, type: 'terminal' },
  { id: 'S5', name: 'Skyport Intl', x: 700, y: 100, type: 'terminal' },
  { id: 'S6', name: 'West End', x: 100, y: 300, type: 'terminal' },
  { id: 'S7', name: 'Garden City', x: 250, y: 200, type: 'normal' },
  { id: 'S8', name: 'Bay Area', x: 650, y: 250, type: 'normal' },
];

export const connections = [
  { from: 'S1', to: 'S2', weight: 8, color: '#ef4444' }, // Red Line
  { from: 'S1', to: 'S3', weight: 6, color: '#ef4444' },
  { from: 'S1', to: 'S4', weight: 10, color: '#3b82f6' }, // Blue Line
  { from: 'S4', to: 'S5', weight: 12, color: '#3b82f6' },
  { from: 'S2', to: 'S6', weight: 5, color: '#22c55e' }, // Green Line
  { from: 'S6', to: 'S7', weight: 7, color: '#22c55e' },
  { from: 'S7', to: 'S1', weight: 4, color: '#22c55e' },
  { from: 'S3', to: 'S8', weight: 5, color: '#eab308' }, // Yellow Line
  { from: 'S8', to: 'S5', weight: 6, color: '#eab308' },
];
