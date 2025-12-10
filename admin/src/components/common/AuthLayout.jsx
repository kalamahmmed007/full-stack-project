// src/components/common/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Outlet /> {/* renders the nested auth routes */}
        </div>
    );
};

export default AuthLayout;
