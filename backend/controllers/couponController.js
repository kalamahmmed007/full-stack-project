const Coupon = require('../models/Coupon');

// Get All Coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Validate Coupon
exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired coupon'
            });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit exceeded'
            });
        }

        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase amount is ৳${coupon.minPurchase}`
            });
        }

        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = (cartTotal * coupon.value) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.value;
        }

        res.status(200).json({
            success: true,
            coupon,
            discount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Coupon (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Coupon (Admin)
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Coupon (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};