import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import adminAuth from '../middleware/adminauth.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', adminAuth, getDashboardStats);

export default router;
