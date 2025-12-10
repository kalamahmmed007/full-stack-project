import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    PlusSquare,
    ShoppingCart,
    Users,
    TicketPercent,
    Star,
    BarChart3,
    Settings,
    User,
} from "lucide-react";
import { useState } from "react";

// fake counts, replace with redux or API later
const orderCounts = { pending: 5, total: 120 };
const productCounts = { total: 80 };

const linkBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition";

const activeLink = "bg-gray-100 text-black";
const inactiveLink =
    "text-gray-500 hover:bg-gray-100 hover:text-black";

const AdminSidebar = () => {
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);

    return (
        <aside className="min-h-screen w-64 border-r bg-white px-4 py-6">
            <div className="mb-8 text-center text-xl font-bold">Admin Panel</div>

            <nav className="space-y-2">
                {/* Dashboard */}
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                </NavLink>

                {/* Products submenu */}
                <div>
                    <p
                        onClick={() => setProductsOpen(!productsOpen)}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                    >
                        <span className="flex items-center gap-3">
                            <Package className="h-5 w-5" />
                            Products
                        </span>
                        <span>{productsOpen ? "▲" : "▼"}</span>
                    </p>
                    {productsOpen && (
                        <div className="flex flex-col gap-1 pl-6">
                            <NavLink
                                to="/admin/products"
                                className={({ isActive }) =>
                                    `${linkBase} ${isActive ? activeLink : inactiveLink}`
                                }
                            >
                                All Products
                                <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                                    {productCounts.total}
                                </span>
                            </NavLink>
                            <NavLink
                                to="/admin/products/add"
                                className={({ isActive }) =>
                                    `${linkBase} ${isActive ? activeLink : inactiveLink}`
                                }
                            >
                                Add Product
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Orders submenu */}
                <div>
                    <p
                        onClick={() => setOrdersOpen(!ordersOpen)}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                    >
                        <span className="flex items-center gap-3">
                            <ShoppingCart className="h-5 w-5" />
                            Orders
                        </span>
                        <span>{ordersOpen ? "▲" : "▼"}</span>
                    </p>
                    {ordersOpen && (
                        <div className="flex flex-col gap-1 pl-6">
                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) =>
                                    `${linkBase} ${isActive ? activeLink : inactiveLink}`
                                }
                            >
                                All Orders
                                <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                                    {orderCounts.total}
                                </span>
                            </NavLink>
                            <NavLink
                                to="/admin/orders?status=pending"
                                className={({ isActive }) =>
                                    `${linkBase} ${isActive ? activeLink : inactiveLink}`
                                }
                            >
                                Pending
                                <span className="ml-auto rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                                    {orderCounts.pending}
                                </span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Users */}
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <Users className="h-5 w-5" />
                    Users
                </NavLink>

                {/* Coupons */}
                <NavLink
                    to="/admin/coupons"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <TicketPercent className="h-5 w-5" />
                    Coupons
                </NavLink>

                {/* Reviews */}
                <NavLink
                    to="/admin/reviews"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <Star className="h-5 w-5" />
                    Reviews
                </NavLink>

                {/* Reports */}
                <NavLink
                    to="/admin/reports"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <BarChart3 className="h-5 w-5" />
                    Reports
                </NavLink>

                {/* Settings */}
                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </NavLink>

                {/* Profile */}
                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? activeLink : inactiveLink}`
                    }
                >
                    <User className="h-5 w-5" />
                    Profile
                </NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
