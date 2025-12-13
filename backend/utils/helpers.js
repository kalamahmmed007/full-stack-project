/ Format price to 2 decimal places
exports.formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
};

// Calculate discount percentage
exports.calculateDiscountPercentage = (originalPrice, salePrice) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Generate random string
exports.generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Calculate pagination
exports.getPaginationData = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
    };
};

// Generate SKU
exports.generateSKU = (productName, categoryName) => {
    const nameCode = productName.substring(0, 3).toUpperCase();
    const catCode = categoryName.substring(0, 2).toUpperCase();
    const random = Math.floor(Math.random() * 10000);
    return `${catCode}-${nameCode}-${random}`;
};

// Slugify text
exports.slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// Calculate order total
exports.calculateOrderTotal = (items, shippingCost = 0, taxRate = 0.05) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
};

// Format date
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
};

// Validate email
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Bangladesh format)
exports.isValidPhone = (phone) => {
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    return phoneRegex.test(phone);
};

// Get date range
exports.getDateRange = (range) => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
        case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'yesterday':
            startDate.setDate(startDate.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        default:
            startDate.setDate(startDate.getDate() - 30);
    }

    return { startDate, endDate: now };