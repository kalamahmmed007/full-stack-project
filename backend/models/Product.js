const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [500, 'Short description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    comparePrice: {
        type: Number,
        min: [0, 'Compare price cannot be negative']
    },
    costPrice: {
        type: Number,
        min: [0, 'Cost price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    isInStock: {
        type: Boolean,
        default: true
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            enum: ['kg', 'g', 'lb', 'oz'],
            default: 'kg'
        }
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
            type: String,
            enum: ['cm', 'm', 'in', 'ft'],
            default: 'cm'
        }
    },
    attributes: [{
        name: String,
        value: String
    }],
    variants: [{
        name: String,
        options: [String],
        price: Number,
        stock: Number,
        sku: String,
        image: String
    }],
    tags: [String],
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'archived'],
        default: 'active'
    },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    },
    warranty: {
        duration: Number,
        unit: {
            type: String,
            enum: ['days', 'months', 'years']
        },
        description: String
    },
    shipping: {
        isFree: {
            type: Boolean,
            default: false
        },
        charges: {
            type: Number,
            default: 0
        },
        estimatedDays: {
            min: Number,
            max: Number
        }
    },
    views: {
        type: Number,
        default: 0
    },
    soldCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create slug before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }

    // Update in-stock status
    this.isInStock = this.stock > 0;

    next();
});

// Calculate final price after discount
productSchema.virtual('finalPrice').get(function () {
    if (this.discount > 0) {
        return this.price - (this.price * this.discount / 100);
    }
    return this.price;
});

// Check if low stock
productSchema.virtual('isLowStock').get(function () {
    return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);