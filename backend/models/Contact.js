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