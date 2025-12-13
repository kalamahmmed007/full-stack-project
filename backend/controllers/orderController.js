const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { Coupon } = require('../models/Address');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            billingAddress,
            paymentMethod,
            couponCode
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided'
            });
        }

        // Validate products and calculate pricing
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0]?.url,
                price: product.price,
                quantity: item.quantity,
                variant: item.variant,
                sku: product.sku
            });
        }

        // Apply coupon if provided
        let discount = 0;
        let couponUsed = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (coupon && coupon.isValid()) {
                discount = coupon.calculateDiscount(subtotal);
                couponUsed = {
                    code: coupon.code,
                    discount,
                    couponId: coupon._id
                };

                // Update coupon usage
                coupon.usageCount += 1;
                coupon.usedBy.push({
                    user: req.user.id,
                    orderAmount: subtotal
                });
                await coupon.save();
            }
        }

        // Calculate totals
        const shippingCost = subtotal >= 1000 ? 0 : 60; // Free shipping over 1000
        const tax = (subtotal - discount) * 0.05; // 5% tax
        const total = subtotal - discount + shippingCost + tax;

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            couponUsed,
            pricing: {
                subtotal,
                discount,
                shippingCost,
                tax,
                total
            },
            isPaid: paymentMethod === 'card',
            paidAt: paymentMethod === 'card' ? Date.now() : null
        });

        // Update product stock and sold count
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, soldCount: item.quantity }
            });
        }

        // Clear user's cart
        await Cart.findOneAndDelete({ user: req.user.id });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders for logged in user
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('items.product', 'name slug images');

        const total = await Order.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email phone')
            .populate('items.product', 'name slug images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};

        // Filter by status
        if (req.query.status) {
            query.orderStatus = req.query.status;
        }

        // Filter by payment status
        if (req.query.isPaid) {
            query.isPaid = req.query.isPaid === 'true';
        }

        // Filter by date range
        if (req.query.startDate || req.query.endDate) {
            query.createdAt = {};
            if (req.query.startDate) {
                query.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Order.countDocuments(query);

        // Calculate statistics
        const stats = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$pricing.total' },
                    avgOrderValue: { $avg: '$pricing.total' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            stats: stats[0] || { totalRevenue: 0, avgOrderValue: 0 },
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        order.updateStatus(status, note, req.user.id);

        // Update delivery status
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check authorization
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Can only cancel pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order at this stage'
            });
        }

        order.orderStatus = 'cancelled';
        order.cancelledAt = Date.now();
        order.cancellationReason = req.body.reason;

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, soldCount: -item.quantity }
            });
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};