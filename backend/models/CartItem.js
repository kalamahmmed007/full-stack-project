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