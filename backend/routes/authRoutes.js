import express from "express";
import { register, login, me, logout, refresh } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
