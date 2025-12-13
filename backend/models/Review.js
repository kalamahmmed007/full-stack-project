const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    title: {
        type: String,
        required: [true, 'Review title is required'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    images: [{
        url: String,
        public_id: String
    }],
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    helpful: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    reply: {
        text: String,
        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        repliedAt: Date
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product ratings after save
reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatings(this.product);
});

// Update product ratings after remove
reviewSchema.post('remove', async function () {
    await this.constructor.calcAverageRatings(this.product);
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId, isApproved: true }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        await this.model('Product').findByIdAndUpdate(productId, {
            'ratings.average': stats[0]?.averageRating || 0,
            'ratings.count': stats[0]?.reviewCount || 0
        });
    } catch (error) {
        console.error('Error updating product ratings:', error);
    }
};

module.exports = mongoose.model('Review', reviewSchema);