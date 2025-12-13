const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    variant: String,
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    coupon: {
        code: String,
        discount: Number
    },
    sessionId: String
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function (next) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    next();
});

// Methods
cartSchema.methods.addItem = function (productId, quantity, price, variant) {
    const existingItem = this.items.find(
        item => item.product.toString() === productId && item.variant === variant
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ product: productId, quantity, price, variant });
    }
};

cartSchema.methods.removeItem = function (itemId) {
    this.items = this.items.filter(item => item._id.toString() !== itemId);
};

cartSchema.methods.updateQuantity = function (itemId, quantity) {
    const item = this.items.find(item => item._id.toString() === itemId);
    if (item) {
        item.quantity = quantity;
    }
};

cartSchema.methods.clearCart = function () {
    this.items = [];
    this.coupon = undefined;
};

module.exports = mongoose.model('Cart', cartSchema);