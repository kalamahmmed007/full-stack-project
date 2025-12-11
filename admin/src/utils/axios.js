import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // Production - use relative path
    return '/api';
};

// Create axios instance
const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Return response data directly
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (window.location.pathname !== '/admin/login') {
                        window.location.href = '/admin/login';
                    }
                    break;

                case 403:
                    // Forbidden - user doesn't have permission
                    console.error('Access forbidden:', data.message);
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found:', data.message);
                    break;

                case 500:
                    // Server error
                    console.error('Server error:', data.message);
                    break;

                default:
                    console.error('API error:', data.message);
            }

            return Promise.reject(error);
        } else if (error.request) {
            // Request made but no response received
            console.error('No response from server');
            return Promise.reject(new Error('Network error - please check your connection'));
        } else {
            // Something else happened
            console.error('Request error:', error.message);
            return Promise.reject(error);
        }
    }
);

// Helper functions for common API calls
export const api = {
    get: (url, config = {}) => axiosInstance.get(url, config),
    post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
    put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
    patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
    delete: (url, config = {}) => axiosInstance.delete(url, config)
};

// Export configured axios instance
export default axiosInstance;