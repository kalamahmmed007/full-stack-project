import React from "react";

const AdminSidebar = () => {
    return (
        <aside className="w-64 min-h-screen p-4 space-y-4 text-white bg-dark">
            <h2 className="text-lg font-bold text-red-600">Menu</h2>
            <ul className="space-y-2">
                <li className="cursor-pointer hover:text-red-500">Dashboard</li>
                <li className="cursor-pointer hover:text-red-500">Products</li>
                <li className="cursor-pointer hover:text-red-500">Orders</li>
                <li className="cursor-pointer hover:text-red-500">Users</li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;
