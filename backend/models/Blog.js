const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxLength: 300
    },
    featuredImage: {
        public_id: String,
        url: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        comment: String,
        isApproved: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    seo: {
        metaTitle: String,
        metaDescription: String,
        metaKeywords: [String],
        ogImage: String
    },
    publishedAt: Date
}, {
    timestamps: true
});

// Create slug
blogSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

module.exports = mongoose.model('Blog', blogSchema);