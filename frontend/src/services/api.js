import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[API] Request with token:', config.url);
        } else {
            console.warn('[API] No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            console.error(`[API] Response error ${status}:`, error.response.data);
            
            // Auto-logout on 401 or 403
            if (status === 401 || status === 403) {
                console.warn('[API] Unauthorized - clearing token and redirecting to login');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('[API] No response received:', error.request);
        } else {
            console.error('[API] Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;