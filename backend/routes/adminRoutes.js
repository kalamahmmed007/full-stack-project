import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/* ONLY SUPER ADMIN */
router.post(
    "/users",
    adminAuth,
    requireRole("super-admin"),
    createAdmin
);

router.delete(
    "/users/:id",
    adminAuth,
    requireRole("super-admin"),
    deleteAdmin
);

export default router;
