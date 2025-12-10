// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
                <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                <h1 className="mb-2 text-4xl font-bold text-gray-800">404</h1>
                <p className="mb-6 text-lg text-gray-600">Oops! The page you are looking for does not exist.</p>
                <Link
                    to="/admin/dashboard"
                    className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                    Go Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
