import axios from 'axios';

// In production (Vercel), use VITE_API_URL environment variable.
// Automatically formats the baseURL so requests like /auth/signup or /api/auth/signup resolve cleanly.
const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL;
    if (!url) return '/api';
    // Remove trailing slashes
    url = url.replace(/\/+$/, '');
    return url;
};

const API = axios.create({
    baseURL: getBaseURL(),
});

// Interceptor to add Authorization Bearer token
API.interceptors.request.use((config) => {
    const userStorage = localStorage.getItem('userInfo');
    if (userStorage) {
        const userInfo = JSON.parse(userStorage);
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
