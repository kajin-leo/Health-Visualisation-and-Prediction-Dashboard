import axios, { type AxiosInstance } from 'axios';
import { API_CONFIG, ML_API_CONFIG } from '../config/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.FULL_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

const mlClient: AxiosInstance = axios.create({
    baseURL: ML_API_CONFIG.FULL_URL,
    timeout: ML_API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.FULL_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

apiClient.interceptors.response.use(response => response,
    async error => {
        if (error.response?.status === 401){
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export {apiClient, authClient, mlClient};