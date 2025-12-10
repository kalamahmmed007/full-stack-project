import React from "react";

const AdminHeader = () => {
    return (
        <header className="text-dark bg-dark flex items-center justify-between px-6 py-4 shadow-md">
            <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
            <div>User Menu</div>
        </header>
    );
};

export default AdminHeader;
