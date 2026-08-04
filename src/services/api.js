import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
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
