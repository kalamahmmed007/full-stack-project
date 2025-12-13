const Wishlist = require('../models/Wishlist');

// Get Wishlist
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products', 'name price images stock ratings');

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: []
            });
        }

        res.status(200).json({
            success: true,
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [productId]
            });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Product already in wishlist'
                });
            }
            wishlist.products.push(productId);
            await wishlist.save();
        }

        await wishlist.populate('products', 'name price images stock ratings');

        res.status(200).json({
            success: true,
            message: 'Added to wishlist',
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== productId
        );

        await wishlist.save();
        await wishlist.populate('products', 'name price images stock ratings');

        res.status(200).json({
            success: true,
            message: 'Removed from wishlist',
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

