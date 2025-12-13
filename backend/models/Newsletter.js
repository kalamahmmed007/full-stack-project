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