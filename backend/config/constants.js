module.exports = {
    // User Roles
    ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        SUPER_ADMIN: 'super_admin',
    },

    // Order Status
    ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        PROCESSING: 'processing',
        SHIPPED: 'shipped',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled',
        REFUNDED: 'refunded',
    },

    // Payment Status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        PAID: 'paid',
        FAILED: 'failed',
        REFUNDED: 'refunded',
    },

    // Payment Methods
    PAYMENT_METHODS: {
        COD: 'cash_on_delivery',
        CARD: 'card',
        BKASH: 'bkash',
        NAGAD: 'nagad',
        ROCKET: 'rocket',
    },

    // Product Status
    PRODUCT_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        OUT_OF_STOCK: 'out_of_stock',
    },

    // Shipping Methods
    SHIPPING_METHODS: {
        STANDARD: 'standard',
        EXPRESS: 'express',
        SAME_DAY: 'same_day',
    },

    // Coupon Types
    COUPON_TYPES: {
        PERCENTAGE: 'percentage',
        FIXED: 'fixed',
    },

    // Image Upload Limits
    IMAGE_LIMITS: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        MAX_FILES: 5,
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    },

    // Pagination
    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },
};