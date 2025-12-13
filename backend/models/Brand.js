const mongoose = require('mongoose');
const slugify = require('slugify');

// ============ BRAND MODEL ============
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Brand name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    logo: {
        url: String,
        public_id: String
    },
    website: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    productCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create slug before saving
brandSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Brand = mongoose.model('Brand', brandSchema);