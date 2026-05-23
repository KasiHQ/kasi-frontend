import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    timeout: 12000, // 12 seconds timeout before failing
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for tokens if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add interceptor to retry requests on network errors or timeouts
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config } = error;
        
        // If config does not exist, reject
        if (!config) return Promise.reject(error);
        
        // Default retry config
        const MAX_RETRIES = 2;
        const RETRY_DELAY = 1000;
        
        config.__retryCount = config.__retryCount || 0;
        
        // Check if we should retry:
        // Only retry if it is a network error (no response) or a timeout,
        // and we haven't exceeded the max retries.
        const isNetworkError = !error.response;
        const isTimeout = error.code === 'ECONNABORTED';
        
        if ((isNetworkError || isTimeout) && config.__retryCount < MAX_RETRIES) {
            config.__retryCount += 1;
            
            // Wait for backoff (1s for first retry, 2s for second retry)
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * config.__retryCount));
            
            // Retry the request
            return api(config);
        }
        
        return Promise.reject(error);
    }
);

export default api;
