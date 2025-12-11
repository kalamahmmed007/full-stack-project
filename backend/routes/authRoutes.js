import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Temporary demo user
const DEMO_USER = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin',
    avatar: null,
    createdAt: new Date()
};

// LOGIN ROUTE
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, password } = req.body;

            if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const payload = {
                user: {
                    id: DEMO_USER.id,
                    email: DEMO_USER.email,
                    role: DEMO_USER.role
                }
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: DEMO_USER.id,
                        name: DEMO_USER.name,
                        email: DEMO_USER.email,
                        role: DEMO_USER.role,
                        avatar: DEMO_USER.avatar
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    }
);

// PROFILE ROUTE
router.get('/me', async (req, res) => {
    try {
        res.json({
            success: true,
            data: DEMO_USER
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
