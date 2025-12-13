const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Address } = require('../models/Address');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// ============ USER PROFILE ============

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('addresses')
            .populate('defaultAddress');

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
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
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
});

// ============ ADDRESS MANAGEMENT ============

// Get all user addresses
router.get('/addresses', async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: addresses.length,
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add new address
router.post('/addresses', async (req, res) => {
    try {
        req.body.user = req.user.id;

        const address = await Address.create(req.body);

        // Add to user's addresses array
        await User.findByIdAndUpdate(req.user.id, {
            $push: { addresses: address._id }
        });

        // Set as default if it's the first address or isDefault is true
        if (req.body.isDefault) {
            await Address.updateMany(
                { user: req.user.id, _id: { $ne: address._id } },
                { isDefault: false }
            );

            await User.findByIdAndUpdate(req.user.id, {
                defaultAddress: address._id
            });
        }

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
});

// Update address
router.put('/addresses/:id', async (req, res) => {
    try {
        let address = await Address.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        address = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Update default address if needed
        if (req.body.isDefault) {
            await Address.updateMany(
                { user: req.user.id, _id: { $ne: address._id } },
                { isDefault: false }
            );

            await User.findByIdAndUpdate(req.user.id, {
                defaultAddress: address._id
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
});

// Delete address
router.delete('/addresses/:id', async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Remove from user's addresses array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { addresses: address._id }
        });

        // If it was the default address, set another as default
        if (address.isDefault) {
            const newDefault = await Address.findOne({ user: req.user.id });
            if (newDefault) {
                newDefault.isDefault = true;
                await newDefault.save();
                await User.findByIdAndUpdate(req.user.id, {
                    defaultAddress: newDefault._id
                });
            }
        }

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
});

// Set default address
router.patch('/addresses/:id/set-default', async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Update all addresses to not default
        await Address.updateMany(
            { user: req.user.id },
            { isDefault: false }
        );

        // Set this address as default
        address.isDefault = true;
        await address.save();

        // Update user's default address
        await User.findByIdAndUpdate(req.user.id, {
            defaultAddress: address._id
        });

        res.status(200).json({
            success: true,
            message: 'Default address updated',
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============ ADMIN ROUTES ============

router.use(authorize('admin'));

// Get all users (Admin)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single user (Admin)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('addresses');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

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
});

// Update user (Admin)
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;