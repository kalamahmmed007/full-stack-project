const Review = require('../models/Review');
const Product = require('../models/Product');

// Create Review
exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // Check if already reviewed
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating,
            comment
        });

        // Update product ratings
        const reviews = await Review.find({ product: productId, isApproved: true });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            ratings: avgRating,
            numOfReviews: reviews.length
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Reviews
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId,
            isApproved: true
        })
            .populate('user', 'name avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Reviews (Admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('product', 'name')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Approve Review (Admin)
exports.approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review approved',
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Review (Admin)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};