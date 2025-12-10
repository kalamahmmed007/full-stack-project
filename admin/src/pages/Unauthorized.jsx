// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Access Denied</h1>
            <p className="mb-6 text-gray-600">
                You do not have permission to view this page.
            </p>
            <Link
                to="/admin/dashboard"
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
                Go Back to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;
