import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('eventflow_token');
      localStorage.removeItem('eventflow_user');
      // Don't redirect if already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/api/auth/register', data),
  login: (data) => API.post('/api/auth/login', data),
  getMe: () => API.get('/api/auth/me'),
};

// ─── Events API ───────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => API.get('/api/events', { params }),
  getById: (id) => API.get(`/api/events/${id}`),
  create: (data) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return API.post('/api/events', data, config);
  },
  update: (id, data) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return API.put(`/api/events/${id}`, data, config);
  },
  delete: (id) => API.delete(`/api/events/${id}`),
  getMyEvents: () => API.get('/api/events/my-events'),
};

// ─── Registrations API ───────────────────────────────────────
export const registrationsAPI = {
  register: (eventId) => API.post(`/api/registrations/register/${eventId}`),
  cancel: (eventId) => API.delete(`/api/registrations/cancel/${eventId}`),
  getMyRegistrations: () => API.get('/api/registrations/my-registrations'),
  getEventRegistrations: (eventId) => API.get(`/api/registrations/event/${eventId}`),
};

// ─── Users API ────────────────────────────────────────────────
export const usersAPI = {
  getProfile: () => API.get('/api/users/profile'),
  updateProfile: (data) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return API.put('/api/users/profile', data, config);
  },
  changePassword: (data) => API.put('/api/users/change-password', data),
};

export default API;
