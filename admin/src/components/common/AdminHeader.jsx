import React from "react";

const AdminHeader = () => {
    return (
        <header className="flex items-center justify-between px-6 py-4 text-white shadow-md bg-dark">
            <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
            <div>User Menu</div>
        </header>
    );
};

export default AdminHeader;
