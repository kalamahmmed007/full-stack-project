import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import authRouter from "./routes/authRoutes.js";
import brandRouter from "./routes/brandRoutes.js";

// Fix __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Socket.io setup (🔴 this is required for live order updates)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// SOCKET EVENTS
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Admin room
    socket.on("admin_join", () => {
        socket.join("admins");
    });

    // Customer joins their own order room
    socket.on("customer_join", (orderId) => {
        socket.join(orderId);
    });

    // Admin updates status
    socket.on("update_status", ({ orderId, status }) => {
        io.to(orderId).emit("order_status_update", status);
        io.to("admins").emit("admin_status_update", { orderId, status });
    });

    // When new order is created
    socket.on("new_order", (order) => {
        io.to("admins").emit("new_order_alert", order);
    });
});

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/auth", authRouter);
app.use("/api/admin", authRouter);
app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/brand", brandRouter);

// Serve uploads folder
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Default route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Start server (🔴 IMPORTANT: use server.listen, not app.listen)
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
