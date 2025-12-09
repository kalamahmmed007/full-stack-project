import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Dummy Admin
const dummyAdmin = {
    id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass' // plain text for dummy admin
};

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields required" });
        }

        // Check if user exists
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ msg: "Email already exists" });

        // Create new user
        const user = await User.create({ name, email, password }); // password hashed in pre-save hook

        res.status(201).json({
            msg: "User created successfully",
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password required" });
        }

        // Dummy admin login
        if (email === dummyAdmin.email && password === dummyAdmin.password) {
            const token = jwt.sign({ id: dummyAdmin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ success: true, token, user: dummyAdmin });
        }

        // Normal user login
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Create tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        res.json({
            msg: "Login success",
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

// Get current user
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

// Logout (optional, frontend deletes token)
export const logout = async (req, res) => {
    res.json({ msg: "Logged out successfully" });
};

// Refresh token
export const refresh = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ msg: "No refresh token" });

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ msg: "Invalid refresh token" });

            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};
