import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    // Get auth state from Redux
    const { isAuthenticated, loading } = useSelector((state) => state.adminAuth);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/admin/login" replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;