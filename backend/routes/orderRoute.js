import express from "express";
import {
    createOrder,
    placeOrder,
    placeOrderRazorpay,
    placeOrderStripe,
    updateStatus,
    allOrders,
    userOrders
} from "../controllers/orderController.js";

import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Create order
orderRouter.post("/create", authUser, createOrder);

// Payment
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
