// API Configuration
const isDevelopment = !window.location.origin.includes('localhost') === false;

const config = {
    // API Base URL
    API_BASE_URL: isDevelopment
        ? 'http://localhost:5000/api'
        : '/api',

    // API Endpoints
    endpoints: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            me: '/auth/me',
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password'
        },
        products: {
            list: '/products',
            create: '/products',
            update: (id) => `/products/${id}`,
            delete: (id) => `/products/${id}`,
            detail: (id) => `/products/${id}`,
            bulkUpload: '/products/bulk-upload'
        },
        categories: {
            list: '/categories',
            create: '/categories',
            update: (id) => `/categories/${id}`,
            delete: (id) => `/categories/${id}`
        },
        orders: {
            list: '/orders',
            detail: (id) => `/orders/${id}`,
            update: (id) => `/orders/${id}`,
            updateStatus: (id) => `/orders/${id}/status`
        },
        customers: {
            list: '/customers',
            detail: (id) => `/customers/${id}`,
            create: '/customers',
            update: (id) => `/customers/${id}`,
            delete: (id) => `/customers/${id}`
        },
        dashboard: {
            stats: '/dashboard/stats',
            salesChart: '/dashboard/sales',
            revenueChart: '/dashboard/revenue'
        },
        upload: {
            single: '/upload/single',
            multiple: '/upload/multiple'
        }
    },

    // Timeout
    timeout: 30000,

    // Headers
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export default config;