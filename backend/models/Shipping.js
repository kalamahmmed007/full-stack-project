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
