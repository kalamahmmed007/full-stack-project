import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <AdminHeader toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;