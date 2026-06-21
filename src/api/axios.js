import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    timeout: 12000, // 12 seconds timeout before failing
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send HttpOnly cookies with every request
});

// ── Silent Token Refresh Interceptor ──
// When the access token expires (401), we silently call /api/auth/refresh
// to get a new one using the refresh token cookie, then retry the original request.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If no config, reject immediately
        if (!originalRequest) return Promise.reject(error);

        // ── Handle 401 with silent refresh ──
        const is401 = error.response && error.response.status === 401;
        const isAuthRoute = originalRequest.url?.includes('/api/auth/login') ||
                            originalRequest.url?.includes('/api/auth/refresh') ||
                            originalRequest.url?.includes('/api/auth/register') ||
                            originalRequest.url?.includes('/api/auth/verify-email') ||
                            originalRequest.url?.includes('/api/auth/forgot-password') ||
                            originalRequest.url?.includes('/api/auth/reset-password');

        if (is401 && !isAuthRoute && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Queue this request and wait for the refresh to complete
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            isRefreshing = true;

            try {
                await api.post('/api/auth/refresh');
                processQueue(null);
                // Retry the original request (cookie is now refreshed)
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                // Refresh failed — session expired, trigger logout
                window.dispatchEvent(new Event('auth-logout'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // ── Handle network errors with retry (existing logic) ──
        const MAX_RETRIES = 2;
        const RETRY_DELAY = 1000;

        originalRequest.__retryCount = originalRequest.__retryCount || 0;

        const isNetworkError = !error.response;
        const isTimeout = error.code === 'ECONNABORTED';

        if ((isNetworkError || isTimeout) && originalRequest.__retryCount < MAX_RETRIES) {
            originalRequest.__retryCount += 1;

            // Wait for backoff (1s for first retry, 2s for second retry)
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * originalRequest.__retryCount));

            // Retry the request
            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default api;
