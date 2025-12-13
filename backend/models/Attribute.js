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