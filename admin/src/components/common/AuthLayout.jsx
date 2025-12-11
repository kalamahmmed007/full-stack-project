// src/components/common/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Left side - optional image / branding */}
            <div className="hidden w-1/2 items-center justify-center bg-blue-600 md:flex">
                <div className="px-10 text-center text-white">
                    <h1 className="mb-4 text-4xl font-bold">Welcome Back!</h1>
                    <p className="text-lg">
                        Login or register to access the admin panel and manage your store.
                    </p>
                </div>
            </div>

            {/* Right side - forms */}
            <div className="flex w-full items-center justify-center bg-gray-50 p-6 md:w-1/2">
                <div className="w-full max-w-md space-y-6">
                    {/* Outlet renders Login, Register, or ForgotPassword */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
