const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'super_admin'],
        default: 'admin'
    },
    permissions: [{
        type: String,
        enum: ['products', 'orders', 'users', 'settings', 'reports']
    }],
    avatar: {
        public_id: String,
        url: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('Admin', adminSchema);