module.exports = {
    // Order Status
    ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        PROCESSING: 'processing',
        SHIPPED: 'shipped',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled',
        RETURNED: 'returned'
    },

    // Payment Status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
        REFUNDED: 'refunded'
    },

    // Payment Methods
    PAYMENT_METHODS: {
        CARD: 'card',
        COD: 'cash_on_delivery',
        BKASH: 'bkash',
        NAGAD: 'nagad',
        ROCKET: 'rocket'
    },

    // User Roles
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin'
    },

    // Product Status
    PRODUCT_STATUS: {
        DRAFT: 'draft',
        ACTIVE: 'active',
        ARCHIVED: 'archived'
    },

    // Default Values
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 100,

    // File Upload
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

    // Shipping
    FREE_SHIPPING_THRESHOLD: 1000,
    DEFAULT_SHIPPING_COST: 60,

    // Tax
    TAX_RATE: 0.05, // 5%

    // Stock
    LOW_STOCK_THRESHOLD: 10,

    // Success Messages
    MESSAGES: {
        SUCCESS: {
            REGISTER: 'Registration successful',
            LOGIN: 'Login successful',
            LOGOUT: 'Logout successful',
            PASSWORD_RESET: 'Password reset email sent',
            PASSWORD_UPDATED: 'Password updated successfully',
            PROFILE_UPDATED: 'Profile updated successfully',
            PRODUCT_CREATED: 'Product created successfully',
            PRODUCT_UPDATED: 'Product updated successfully',
            PRODUCT_DELETED: 'Product deleted successfully',
            ORDER_CREATED: 'Order created successfully',
            ORDER_UPDATED: 'Order updated successfully',
            ORDER_CANCELLED: 'Order cancelled successfully'
        },
        ERROR: {
            NOT_FOUND: 'Resource not found',
            UNAUTHORIZED: 'Not authorized to access this resource',
            INVALID_CREDENTIALS: 'Invalid email or password',
            DUPLICATE: 'Resource already exists',
            VALIDATION: 'Validation error',
            SERVER_ERROR: 'Internal server error'
        }
    },

    // Email Templates
    EMAIL_SUBJECTS: {
        WELCOME: 'Welcome to Our Store',
        PASSWORD_RESET: 'Password Reset Request',
        ORDER_CONFIRMATION: 'Order Confirmation',
        ORDER_SHIPPED: 'Your Order Has Been Shipped',
        ORDER_DELIVERED: 'Order Delivered'
    },

    // Regex Patterns
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_BD: /^(\+8801|01)[3-9]\d{8}$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    }
};