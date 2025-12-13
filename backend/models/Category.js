const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
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
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: {
        url: String,
        public_id: String
    },
    icon: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    },
    productCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create slug before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Virtual for children categories
categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});

// Get all subcategories
categorySchema.methods.getSubcategories = async function () {
    return await this.model('Category').find({ parent: this._id });
};

module.exports = mongoose.model('Category', categorySchema);