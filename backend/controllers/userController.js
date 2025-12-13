const User = require('../models/User');
const Address = require('../models/Address');
const cloudinary = require('cloudinary').v2;

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('addresses');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Avatar
exports.updateAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Delete old avatar
        if (user.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // Upload new avatar
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });

        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Address
exports.addAddress = async (req, res) => {
    try {
        const address = await Address.create({
            ...req.body,
            user: req.user._id
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { addresses: address._id }
        });

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Address
exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { addresses: address._id }
        });

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};