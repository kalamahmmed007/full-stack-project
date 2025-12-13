const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build query
        let query = { status: 'active' };

        // Search
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Brand filter
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Rating filter
        if (req.query.minRating) {
            query['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
        }

        // Featured, best seller, new arrival filters
        if (req.query.isFeatured === 'true') query.isFeatured = true;
        if (req.query.isBestSeller === 'true') query.isBestSeller = true;
        if (req.query.isNewArrival === 'true') query.isNewArrival = true;

        // In stock filter
        if (req.query.inStock === 'true') query.isInStock = true;

        // Sorting
        let sort = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price_asc':
                    sort.price = 1;
                    break;
                case 'price_desc':
                    sort.price = -1;
                    break;
                case 'newest':
                    sort.createdAt = -1;
                    break;
                case 'popular':
                    sort.soldCount = -1;
                    break;
                case 'rating':
                    sort['ratings.average'] = -1;
                    break;
                default:
                    sort.createdAt = -1;
            }
        } else {
            sort.createdAt = -1;
        }

        // Execute query
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('brand', 'name')
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            $or: [
                { _id: req.params.id },
                { slug: req.params.id }
            ]
        })
            .populate('category', 'name slug')
            .populate('brand', 'name logo')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'firstName lastName avatar' },
                options: { limit: 10, sort: { createdAt: -1 } }
            });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            const imageUploads = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.path, 'products'))
            );
            req.body.images = imageUploads.map((img, index) => ({
                url: img.url,
                public_id: img.public_id,
                isDefault: index === 0
            }));
        }

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const imageUploads = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.path, 'products'))
            );

            const newImages = imageUploads.map(img => ({
                url: img.url,
                public_id: img.public_id,
                isDefault: false
            }));

            req.body.images = [...product.images, ...newImages];
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete images from cloudinary
        if (product.images && product.images.length > 0) {
            await Promise.all(
                product.images.map(img => deleteFromCloudinary(img.public_id))
            );
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const relatedProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            status: 'active'
        })
            .limit(8)
            .select('name slug price images ratings');

        res.status(200).json({
            success: true,
            products: relatedProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
    try {
        const { stock } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock, isInStock: stock > 0 },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};