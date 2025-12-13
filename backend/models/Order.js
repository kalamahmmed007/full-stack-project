const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
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
        variant: String,
        sku: String
    }],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: String,
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'Bangladesh' }
    },
    billingAddress: {
        fullName: String,
        phone: String,
        email: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'Bangladesh' }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'cash_on_delivery', 'bkash', 'nagad', 'rocket']
    },
    paymentInfo: {
        id: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paidAt: Date,
        transactionId: String
    },
    pricing: {
        subtotal: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        shippingCost: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true,
            default: 0
        }
    },
    couponUsed: {
        code: String,
        discount: Number,
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon'
        }
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        note: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    tracking: {
        carrier: String,
        trackingNumber: String,
        trackingUrl: String,
        estimatedDelivery: Date
    },
    notes: {
        customer: String,
        admin: String
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    refund: {
        status: {
            type: String,
            enum: ['not_requested', 'requested', 'approved', 'rejected', 'completed']
        },
        reason: String,
        amount: Number,
        requestedAt: Date,
        processedAt: Date
    }
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

// Calculate pricing totals
orderSchema.methods.calculateTotals = function () {
    this.pricing.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.pricing.total = this.pricing.subtotal - this.pricing.discount + this.pricing.shippingCost + this.pricing.tax;
};

// Add status to history
orderSchema.methods.updateStatus = function (status, note, updatedBy) {
    this.orderStatus = status;
    this.statusHistory.push({
        status,
        note,
        updatedBy,
        timestamp: new Date()
    });
};

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

module.exports = mongoose.model('Order', orderSchema);