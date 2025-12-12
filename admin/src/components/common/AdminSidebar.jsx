import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Archive,
    ShoppingCart,
    Users,
    UserCog,
    Megaphone,
    Star,
    Truck,
    CreditCard,
    FileText,
    BarChart3,
    Settings,
    Bell,
    Activity,
    ChevronDown,
    ChevronRight,
    X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    // Icon mapping
    const iconMap = {
        LayoutDashboard,
        Package,
        Archive,
        ShoppingCart,
        Users,
        UserCog,
        Megaphone,
        Star,
        Truck,
        CreditCard,
        FileText,
        BarChart3,
        Settings,
        Bell,
        Activity
    };

    // Menu items configuration
    const menuItems = [
        {
            id: 1,
            title: "Dashboard",
            icon: "LayoutDashboard",
            path: "/dashboard",
            badge: null
        },
        {
            id: 2,
            title: "Products",
            icon: "Package",
            path: "/products",
            badge: null,
            submenu: [
                { title: "All Products", path: "/products" },
                { title: "Add Product", path: "/products/add" },
                { title: "edit Product", path: "/products/edit/:id" },
                { title: "Attributes", path: "/attributes" },
                { title: "Bulk Upload", path: "/products/bulk-upload" }
            ]
        },
        {
            id: 3,
            title: "Categories",
            icon: "Archive",
            path: "/categories",
            submenu: [
                { title: "All Categories", path: "/categories" },
                { title: "Add Category", path: "/categories/add" },
                { title: "Subcategories", path: "/subcategories" },
                { title: "Add Subcategory", path: "/subcategories/add" },

            ]
        },
        {
            id: 4,
            title: "Inventory",
            icon: "Archive",
            path: "/inventory",
            badge: "12",
            submenu: [
                { title: "Stock List", path: "/inventory" },
                { title: "Low Stock", path: "/inventory/low-stock" },
                { title: "Stock Update", path: "/inventory/update" },
                { title: "Stock History", path: "/inventory/history" }
            ]
        },
        {
            id: 5,
            title: "Orders",
            icon: "ShoppingCart",
            path: "/orders",
            badge: "5",
            submenu: [
                { title: "All Orders", path: "/orders" },
                { title: "Pending", path: "/orders?status=pending" },
                { title: "Processing", path: "/orders?status=processing" },
                { title: "Shipped", path: "/orders?status=shipped" },
                { title: "Delivered", path: "/orders?status=delivered" },
                { title: "Cancelled", path: "/orders?status=cancelled" },
                { title: "Returns", path: "/orders/returns" },
                { title: "track Order", path: "/orders/track" }
            ]
        },
        {
            id: 6,
            title: "Customers",
            icon: "Users",
            path: "/customers",
            submenu: [
                { title: "All Customers", path: "/customers" },
                { title: "Customer Groups", path: "/customers/groups" },
                { title: "Customer Activity", path: "/customers/activity" }
            ]
        },
        {
            id: 7,
            title: "Users & Roles",
            icon: "UserCog",
            path: "/users",
            submenu: [
                { title: "All Users", path: "/users" },
                { title: "Add User", path: "/users/add" },
                { title: "Roles", path: "/users/roles" },
                { title: "Permissions", path: "/users/permissions" }
            ]
        },
        {
            id: 8,
            title: "Brands",
            icon: "Archive",
            path: "/brands",
            submenu: [
                { title: "All Brands", path: "/brands" },
                { title: "Add Brand", path: "/brands/add" },
                { title: "Edit Brand", path: "/brands/edit/:id" }
            ]
        },
        {
            id: 9,
            title: "Marketing",
            icon: "Megaphone",
            path: "/marketing",
            submenu: [
                { title: "Coupons", path: "/marketing/coupons" },
                { title: "Flash Sales", path: "/marketing/flash-sales" },
                { title: "Banners", path: "/marketing/banners" },
                { title: "Email Campaigns", path: "/marketing/email-campaigns" },
                { title: "SMS Campaigns", path: "/marketing/sms-campaigns" },
                { title: "Push Notifications", path: "/marketing/push-notifications" },
                { title: "Newsletter", path: "/marketing/newsletter" }
            ]
        },
        {
            id: 10,
            title: "Reviews",
            icon: "Star",
            path: "/reviews",
            badge: "3",
            submenu: [
                { title: "All Reviews", path: "/reviews" },
                { title: "Pending", path: "/reviews?status=pending" },
                { title: "Approved", path: "/reviews?status=approved" },
                { title: "Review Stats", path: "/reviews/stats" }
            ]
        },
        {
            id: 11,
            title: "Shipping",
            icon: "Truck",
            path: "/shipping",
            submenu: [
                { title: "Shipping Methods", path: "/shipping/methods" },
                { title: "Shipping Zones", path: "/shipping/zones" },
                { title: "Delivery Partners", path: "/shipping/partners" }
            ]
        },
        {
            id: 12,
            title: "Payments",
            icon: "CreditCard",
            path: "/payments",
            submenu: [
                { title: "Transactions", path: "/payments/transactions" },
                { title: "Payment Gateways", path: "/payments/gateways" },
                { title: "Payouts", path: "/payments/payouts" }
            ]
        },
        {
            id: 13,
            title: "CMS",
            icon: "FileText",
            path: "/cms",
            submenu: [
                { title: "Pages", path: "/cms/pages" },
                { title: "Blog Posts", path: "/cms/blogs" },
                { title: "FAQs", path: "/cms/faqs" },
                { title: "Media Library", path: "/cms/media" }
            ]
        },
        {
            id: 14,
            title: "Reports",
            icon: "BarChart3",
            path: "/reports",
            submenu: [
                { title: "Sales Report", path: "/reports/sales" },
                { title: "Revenue Report", path: "/reports/revenue" },
                { title: "Inventory Report", path: "/reports/inventory" },
                { title: "Customer Report", path: "/reports/customers" },
                { title: "Product Report", path: "/reports/products" },
                { title: "Tax Report", path: "/reports/tax" },
                { title: "Export Report", path: "/reports/export" }
            ]
        },
        {
            id: 15,
            title: "Settings",
            icon: "Settings",
            path: "/settings",
            submenu: [
                { title: "General", path: "/settings/general" },
                { title: "Store", path: "/settings/store" },
                { title: "Payment", path: "/settings/payment" },
                { title: "Shipping", path: "/settings/shipping" },
                { title: "Email", path: "/settings/email" },
                { title: "SMS", path: "/settings/sms" },
                { title: "SEO", path: "/settings/seo" },
                { title: "Tax", path: "/settings/tax" },
                { title: "Currency", path: "/settings/currency" },
                { title: "Language", path: "/settings/language" },
                { title: "Theme", path: "/settings/theme" },
                { title: "API", path: "/settings/api" },
                { title: "Backup", path: "/settings/backup" }
            ]
        },
        {
            id: 17,
            title: "Notifications",
            icon: "Bell",
            path: "/notifications",
            badge: "8"
        },
        {
            id: 18,
            title: "Activity Logs",
            icon: "Activity",
            path: "/activity-logs"
        }
    ];

    // Toggle submenu
    const toggleMenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    // Check if path is active
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Check if submenu has active item
    const hasActiveSubmenu = (submenu) => {
        return submenu?.some(item => isActive(item.path));
    };

    // Render menu item
    const renderMenuItem = (item) => {
        const Icon = iconMap[item.icon];
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isMenuOpen = openMenus[item.id] || hasActiveSubmenu(item.submenu);
        const itemActive = isActive(item.path);

        return (
            <li key={item.id} className="mb-1">
                {hasSubmenu ? (
                    <>
                        <button
                            onClick={() => toggleMenu(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${itemActive || hasActiveSubmenu(item.submenu)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} />
                                <span className="font-medium">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                        {item.badge}
                                    </span>
                                )}
                                {isMenuOpen ? (
                                    <ChevronDown size={18} />
                                ) : (
                                    <ChevronRight size={18} />
                                )}
                            </div>
                        </button>

                        {/* Submenu */}
                        {isMenuOpen && (
                            <ul className="pl-4 mt-1 ml-4 border-l-2 border-gray-200">
                                {item.submenu.map((subItem, index) => (
                                    <li key={index}>
                                        <Link
                                            to={subItem.path}
                                            onClick={onClose}
                                            className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive(subItem.path)
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {subItem.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${itemActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon size={20} />
                            <span className="font-medium">{item.title}</span>
                        </div>
                        {item.badge && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                )}
            </li>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:shadow-none w-64 flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                            <span className="text-lg font-bold text-white">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Admin Panel</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 lg:hidden"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map(item => renderMenuItem(item))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                            <span className="text-sm font-semibold text-white">AD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;