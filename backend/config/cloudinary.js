const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to cloudinary
const uploadToCloudinary = async (file, folder = 'ecommerce') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

// Delete image from cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error(`Image deletion failed: ${error.message}`);
    }
};

// Upload multiple images
const uploadMultipleToCloudinary = async (files, folder = 'ecommerce') => {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw new Error(`Multiple image upload failed: ${error.message}`);
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary,
    uploadMultipleToCloudinary,
};