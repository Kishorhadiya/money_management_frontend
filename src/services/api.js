import axios from 'axios';

// In production (Vercel), use VITE_API_URL environment variable
// In development, use the Vite proxy (/api → localhost:5000)
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
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
