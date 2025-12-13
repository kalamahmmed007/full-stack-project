const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);

module.exports = router;