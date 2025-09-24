export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5484',
    BASE_PATH: import.meta.env.VITE_API_BASE_PATH || '/api',
    TIMEOUT: 10000,

    get FULL_URL() {
        return `${this.BASE_URL}${this.BASE_PATH}`;
    }
};

export const ML_API_CONFIG = {
    BASE_URL: 'http://localhost:5485',
    BASE_PATH: import.meta.env.VITE_API_BASE_PATH || '/api',
    TIMEOUT: 10000,

    get FULL_URL() {
        return `${this.BASE_URL}${this.BASE_PATH}`;
    }
};

export const ENV = {
    API_URL: import.meta.env.VITE_API_URL,
    API_BASE_PATH: import.meta.env.VITE_API_BASE_PATH,
    APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Interactive Dashboard',
    IS_DEBUG: import.meta.env.VITE_DEBUG === 'true',
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
};

if (ENV.IS_DEV) {
    console.log('API Configuration:', API_CONFIG);
    console.log('Environment Variables:', ENV);
}