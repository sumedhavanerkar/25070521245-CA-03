import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralized error extraction & token management
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If the token is invalid or expired, clear it from localStorage
    if (err.response?.status === 401) {
      const msg = err.response?.data?.message || '';
      if (
        msg.includes('token') ||
        msg.includes('log in') ||
        msg.includes('Authentication required')
      ) {
        localStorage.removeItem('clf_token');
      }
    }

    const message =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred';
    err.friendlyMessage = message;
    return Promise.reject(err);
  }
);

// ── Items ─────────────────────────────────────────────────────────────────────
export const itemsApi = {
  getAll: (params = {}) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  getStats: () => api.get('/items/stats'),
  getMine: () => api.get('/items/mine'),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  updateStatus: (id, status) => api.patch(`/items/${id}/status`, { status }),
  delete: (id) => api.delete(`/items/${id}`),
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// ── Health ────────────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
