// ============================================
// models/OrderItem.js
// ============================================
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderItem', orderItemSchema);


// ============================================
// models/CartItem.js
// ============================================
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Calculate total price before saving
cartItemSchema.pre('save', function (next) {
    this.totalPrice = this.price * this.quantity;
    next();
});

module.exports = mongoose.model('CartItem', cartItemSchema);


// ============================================
// models/Payment.js
// ============================================
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    method: {
        type: String,
        enum: ['cash_on_delivery', 'card', 'bkash', 'nagad', 'rocket', 'bank_transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'BDT'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    paymentDetails: {
        cardNumber: String,
        cardHolderName: String,
        bankName: String,
        accountNumber: String,
        mobileNumber: String
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    refundedAt: Date,
    failureReason: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    paidAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);


// ============================================
// models/Shipping.js
// ============================================
const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    method: {
        type: String,
        enum: ['standard', 'express', 'same_day', 'international'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    estimatedDays: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    weightLimit: {
        min: Number,
        max: Number
    },
    regions: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    freeShippingThreshold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipping', shippingSchema);


// ============================================
// models/Attribute.js
// ============================================
const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ['color', 'size', 'material', 'custom'],
        required: true
    },
    values: [{
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        colorCode: String, // For color attributes
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create slug
const slugify = require('slugify');
attributeSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Attribute', attributeSchema);


// ============================================
// models/Newsletter.js
// ============================================
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    name: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: Date,
    unsubscribedAt: Date,
    source: {
        type: String,
        enum: ['website', 'checkout', 'popup', 'manual'],
        default: 'website'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Newsletter', newsletterSchema);


// ============================================
// models/Blog.js
// ============================================
const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxLength: 300
    },
    featuredImage: {
        public_id: String,
        url: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        comment: String,
        isApproved: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    seo: {
        metaTitle: String,
        metaDescription: String,
        metaKeywords: [String],
        ogImage: String
    },
    publishedAt: Date
}, {
    timestamps: true
});

// Create slug
blogSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

module.exports = mongoose.model('Blog', blogSchema);


// ============================================
// models/Contact.js
// ============================================
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: 100
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Please enter subject'],
        trim: true,
        maxLength: 200
    },
    message: {
        type: String,
        required: [true, 'Please enter your message'],
        maxLength: 1000
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    notes: [{
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        note: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolvedAt: Date,
    closedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);


// ============================================
// models/Settings.js
// ============================================
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // General Settings
    siteName: {
        type: String,
        default: 'E-Commerce Store'
    },
    siteDescription: String,
    siteLogo: {
        public_id: String,
        url: String
    },
    favicon: {
        public_id: String,
        url: String
    },

    // Contact Information
    contactEmail: String,
    contactPhone: String,
    contactAddress: String,

    // Social Media Links
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        youtube: String,
        linkedin: String
    },

    // Business Settings
    currency: {
        type: String,
        default: 'BDT'
    },
    currencySymbol: {
        type: String,
        default: '৳'
    },
    timezone: {
        type: String,
        default: 'Asia/Dhaka'
    },
    language: {
        type: String,
        default: 'en'
    },

    // Tax Settings
    taxEnabled: {
        type: Boolean,
        default: false
    },
    taxRate: {
        type: Number,
        default: 0
    },
    taxType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },

    // Shipping Settings
    freeShippingThreshold: {
        type: Number,
        default: 0
    },

    // Email Settings
    emailFrom: String,
    emailHost: String,
    emailPort: Number,
    emailUser: String,
    emailPassword: String,

    // Payment Gateway Settings
    paymentGateways: {
        sslcommerz: {
            enabled: Boolean,
            storeId: String,
            storePassword: String,
            isLive: Boolean
        },
        stripe: {
            enabled: Boolean,
            publicKey: String,
            secretKey: String
        },
        paypal: {
            enabled: Boolean,
            clientId: String,
            clientSecret: String
        },
        cashOnDelivery: {
            enabled: {
                type: Boolean,
                default: true
            }
        }
    },

    // SEO Settings
    seo: {
        metaTitle: String,
        metaDescription: String,
        metaKeywords: [String],
        ogImage: String,
        googleAnalyticsId: String,
        facebookPixelId: String
    },

    // Order Settings
    orderPrefix: {
        type: String,
        default: 'ORD'
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },

    // Maintenance Mode
    maintenanceMode: {
        enabled: {
            type: Boolean,
            default: false
        },
        message: String
    },

    // Terms & Policies
    termsAndConditions: String,
    privacyPolicy: String,
    returnPolicy: String,
    shippingPolicy: String,

    // Newsletter
    newsletterEnabled: {
        type: Boolean,
        default: true
    },

    // Reviews
    reviewsEnabled: {
        type: Boolean,
        default: true
    },
    reviewsRequireApproval: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSiteSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);