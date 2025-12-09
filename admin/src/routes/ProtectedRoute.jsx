// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    // Get auth state from Redux
    const { isAuthenticated, loading } = useSelector((state) => state.adminAuth);

    // While checking auth, show loader
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // If authenticated, render child routes
    return <Outlet />;
};

export default ProtectedRoute;
