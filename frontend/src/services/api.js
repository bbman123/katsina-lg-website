import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const POLL_INTERVAL_MS = Number(import.meta.env.VITE_POLL_INTERVAL_MS || 8000);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Opportunities API
export const opportunitiesAPI = {
    getAll: (params) => api.get('/opportunities', { params }),
    getById: (id) => api.get(`/opportunities/${id}`),
    create: (data) => api.post('/opportunities', data),
    update: (id, data) => api.put(`/opportunities/${id}`, data),
    delete: (id) => api.delete(`/opportunities/${id}`),
    apply: (id) => api.post(`/opportunities/${id}/apply`),
};

// Media API
export const mediaAPI = {
    getAll: (params) => api.get('/media', { params }),
    upload: (formData) => api.post('/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => api.delete(`/media/${id}`),
};

// Public API
export const publicAPI = {
    getData: () => api.get('/public-data'),
    getStats: () => api.get('/public-stats'),
};

// Polling service
export const startPolling = (onData) => {
    let cancelled = false;

    const poll = async () => {
        try {
            const response = await publicAPI.getData();
            if (!cancelled && response.data.success) {
                onData(response.data.data);
            }
        } catch (error) {
            console.warn('Polling error:', error.message);
        }

        if (!cancelled) {
            setTimeout(poll, POLL_INTERVAL_MS);
        }
    };

    poll();

    return () => {
        cancelled = true;
    };
};

export default api;