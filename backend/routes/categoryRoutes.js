const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { Coupon } = require('../models/Address');

// ============ CATEGORY ROUTES ============
const categoryRouter = express.Router();

// Get all categories
categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('children')
            .sort({ order: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single category
categoryRouter.get('/:id', async (req, res) => {
    try {
        const category = await Category.findOne({
            $or: [{ _id: req.params.id }, { slug: req.params.id }]
        }).populate('children');

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin only routes
categoryRouter.use(protect, authorize('admin'));

// Create category
categoryRouter.post('/', async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update category
categoryRouter.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete category
categoryRouter.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ REVIEW ROUTES ============
const reviewRouter = express.Router();

// Get all reviews for a product
reviewRouter.get('/product/:productId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { product: req.params.productId };
        if (req.query.approved === 'true') {
            query.isApproved = true;
        }

        const reviews = await Review.find(query)
            .populate('user', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Protected routes
reviewRouter.use(protect);

// Create review
reviewRouter.post('/', async (req, res) => {
    try {
        req.body.user = req.user.id;

        const existingReview = await Review.findOne({
            product: req.body.product,
            user: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update review
reviewRouter.put('/:id', async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete review
reviewRouter.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await review.deleteOne();

        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ COUPON ROUTES ============
const couponRouter = express.Router();

couponRouter.use(protect);

// Validate coupon
couponRouter.post('/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ success: false, message: 'Coupon is not valid' });
        }

        if (subtotal < coupon.minPurchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase amount is $${coupon.minPurchase}`
            });
        }

        const discount = coupon.calculateDiscount(subtotal);

        res.status(200).json({
            success: true,
            coupon: {
                code: coupon.code,
                discount,
                discountType: coupon.discountType
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin routes
couponRouter.use(authorize('admin'));

// Get all coupons
couponRouter.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: coupons.length, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create coupon
couponRouter.post('/', async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update coupon
couponRouter.put('/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete coupon
couponRouter.delete('/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = {
    categoryRoutes: categoryRouter,
    reviewRoutes: reviewRouter,
    couponRoutes: couponRouter
};