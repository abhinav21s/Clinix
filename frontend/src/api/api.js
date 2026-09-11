const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getStaff: async (token) => {
    const res = await fetch(`${API_URL}/staff`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  addStaff: async (token, data) => {
    const res = await fetch(`${API_URL}/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateStaff: async (token, id, data) => {
    const res = await fetch(`${API_URL}/staff/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteStaff: async (token, id) => {
    const res = await fetch(`${API_URL}/staff/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
