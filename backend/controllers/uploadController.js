const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Upload Single Image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'uploads'
        });

        // Delete temp file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload Multiple Images
exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload images'
            });
        }

        const images = [];

        for (let file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'uploads'
            });
            images.push({
                public_id: result.public_id,
                url: result.secure_url
            });
            fs.unlinkSync(file.path);
        }

        res.status(200).json({
            success: true,
            images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Image
exports.deleteImage = async (req, res) => {
    try {
        const { public_id } = req.body;

        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};