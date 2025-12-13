const express = require('express');
const { protect, authorize } = require('../middleware/auth');

// ============ ORDER ROUTES ============
const orderRouter = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');

// Protected routes - User
orderRouter.use(protect);

orderRouter.route('/').post(createOrder);
orderRouter.get('/my-orders', getMyOrders);
orderRouter.route('/:id').get(getOrder);
orderRouter.patch('/:id/cancel', cancelOrder);

// Protected routes - Admin only
orderRouter.get('/', authorize('admin'), getAllOrders);
orderRouter.patch('/:id/status', authorize('admin'), updateOrderStatus);

// ============ CART ROUTES ============
const cartRouter = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

cartRouter.use(protect);

// Get user's cart
cartRouter.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add item to cart
cartRouter.post('/add', async (req, res) => {
    try {
        const { productId, quantity = 1, variant } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        cart.addItem(productId, quantity, product.price, variant);
        await cart.save();

        cart = await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update cart item quantity
cartRouter.put('/update/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.updateQuantity(req.params.itemId, quantity);
        await cart.save();

        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Remove item from cart
cartRouter.delete('/remove/:itemId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.removeItem(req.params.itemId);
        await cart.save();

        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Clear cart
cartRouter.delete('/clear', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.clearCart();
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    orderRoutes: orderRouter,
    cartRoutes: cartRouter
};