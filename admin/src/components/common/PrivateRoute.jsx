// src/components/common/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
    // ✅ Correct slice key (auth, not Auth)
    const token = useSelector((state) => state.auth?.token);

    // Optional: fallback to localStorage for refresh persistence
    const storedToken = localStorage.getItem("token");
    const isLoggedIn = token || storedToken;

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
