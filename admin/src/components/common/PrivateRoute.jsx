// src/components/common/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ adminOnly = false }) => {
    // ✅ Grab token & user from Redux (slice names are case-sensitive)
    const { token, user } = useSelector((state) => state.auth || {});

    // Optional: fallback to localStorage if you want refresh persistence
    const storedToken = localStorage.getItem("token");
    const isLoggedIn = token || storedToken;

    // Not logged in → redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Admin-only route
    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // Otherwise, allow access
    return <Outlet />;
};

export default PrivateRoute;
