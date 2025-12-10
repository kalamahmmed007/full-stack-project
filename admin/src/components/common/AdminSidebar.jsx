import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Warehouse,
    ShoppingCart,
    Users,
    Megaphone,
    CreditCard,
    Truck,
    FileText,
    BarChart3,
    UserCog,
    Settings,
    Bell,
    Palette,
    Server,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Tag,
    Grid,
    Star,
    PlusSquare,
    Upload,
    AlertCircle,
    History,
    Clock,
    CheckCircle,
    XCircle,
    RotateCcw,
    Mail,
    MessageSquare,
    Zap,
    Image,
    Database,
    FileBarChart,
    Shield,
    Activity,
    Layers,
    Chrome,
    HardDrive,
    AlertTriangle,
    Wrench,
    BookOpen,
    Phone,
    Info
} from "lucide-react";
import { useState } from "react";

// Fake counts - replace with Redux or API later
const counts = {
    orders: { pending: 5, total: 120 },
    products: { total: 80 },
    notifications: 3,
    tickets: 7
};

const linkBase = "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200";
const activeLink = "bg-blue-50 text-blue-600 shadow-sm";
const inactiveLink = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

const submenuLinkBase = "flex items-center gap-3 px-3 py-2 pl-11 rounded-lg text-sm transition-all duration-200";
const activeSubmenuLink = "bg-blue-50 text-blue-600 font-medium";
const inactiveSubmenuLink = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";

const AdminSidebar = () => {
    const [openMenus, setOpenMenus] = useState({
        products: false,
        inventory: false,
        orders: false,
        customers: false,
        marketing: false,
        payments: false,
        shipping: false,
        cms: false,
        reports: false,
        users: false,
        settings: false,
        appearance: false,
        system: false,
        support: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <aside className="h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white">
            {/* Logo Section */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                        <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-xs text-gray-500">E-commerce Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1 p-4">
                {/* Dashboard */}
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => `${linkBase} ${isActive ? activeLink : inactiveLink}`}
                >
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                    </div>
                </NavLink>

                {/* Products */}
                <div>
                    <button
                        onClick={() => toggleMenu('products')}
                        className={`${linkBase} ${inactiveLink} w-full`}
                    >
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5" />
                            <span>Products</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                {counts.products.total}
                            </span>
                            {openMenus.products ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                    </button>
                    {openMenus.products && (
                        <div className="mt-1 space-y-1">
                            <NavLink to="/admin/products" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Grid className="h-4 w-4" />
                                <span>All Products</span>
                            </NavLink>
                            <NavLink to="/admin/products/add" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <PlusSquare className="h-4 w-4" />
                                <span>Add Product</span>
                            </NavLink>
                            <NavLink to="/admin/categories" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Layers className="h-4 w-4" />
                                <span>Categories</span>
                            </NavLink>
                            <NavLink to="/admin/categories/sub" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Layers className="h-4 w-4" />
                                <span>Sub Categories</span>
                            </NavLink>
                            <NavLink to="/admin/brands" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Tag className="h-4 w-4" />
                                <span>Brands</span>
                            </NavLink>
                            <NavLink to="/admin/attributes" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Settings className="h-4 w-4" />
                                <span>Attributes</span>
                            </NavLink>
                            <NavLink to="/admin/products/bulk-upload" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Upload className="h-4 w-4" />
                                <span>Bulk Upload</span>
                            </NavLink>
                            <NavLink to="/admin/reviews" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Star className="h-4 w-4" />
                                <span>Product Reviews</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Inventory */}
                <div>
                    <button
                        onClick={() => toggleMenu('inventory')}
                        className={`${linkBase} ${inactiveLink} w-full`}
                    >
                        <div className="flex items-center gap-3">
                            <Warehouse className="h-5 w-5" />
                            <span>Inventory</span>
                        </div>
                        {openMenus.inventory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {openMenus.inventory && (
                        <div className="mt-1 space-y-1">
                            <NavLink to="/admin/inventory" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <Database className="h-4 w-4" />
                                <span>Stock Management</span>
                            </NavLink>
                            <NavLink to="/admin/inventory/low-stock" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <AlertCircle className="h-4 w-4" />
                                <span>Low Stock Alert</span>
                            </NavLink>
                            <NavLink to="/admin/inventory/history" className={({ isActive }) => `${submenuLinkBase} ${isActive ? activeSubmenuLink : inactiveSubmenuLink}`}>
                                <History className="h-4 w-4" />
                                <span>Stock History</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* The rest of the menu sections (Orders, Customers, Marketing, Payments, Shipping, CMS, Reports, Users, Settings, Appearance, System, Support) can be added in the same pattern using toggleMenu and NavLink components. */}

            </nav>
        </aside>
    );
};

export default AdminSidebar;
