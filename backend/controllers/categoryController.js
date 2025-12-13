const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('parent', 'name slug')
            .sort('order');

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Category Details
exports.getCategoryDetails = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent', 'name slug');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Category (Admin)
exports.createCategory = async (req, res) => {
    try {
        let imageData = {};

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categories'
            });
            imageData = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const category = await Category.create({
            ...req.body,
            image: imageData
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Category (Admin)
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (req.file) {
            if (category.image?.public_id) {
                await cloudinary.uploader.destroy(category.image.public_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categories'
            });
            req.body.image = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Category (Admin)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (category.image?.public_id) {
            await cloudinary.uploader.destroy(category.image.public_id);
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};