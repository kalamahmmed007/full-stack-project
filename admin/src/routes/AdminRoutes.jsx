import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AuthLayout from "../components/common/AuthLayout";
import PrivateRoute from "../components/common/PrivateRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard";

// Products
import Products from "../pages/products/Products";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";
import ProductDetails from "../pages/products/ProductDetails";

// Categories
import Categories from "../pages/categories/Categories";
import SubCategories from "../pages/categories/SubCategories";

// Inventory
import Inventory from "../pages/inventory/Inventory";

// Orders
import Orders from "../pages/orders/Orders";
import OrderDetails from "../pages/orders/OrderDetails";

// Customers
import Customers from "../pages/customers/Customers";
import CustomerDetails from "../pages/customers/CustomerDetails";

// Users & Roles
import Users from "../pages/users/Users";
import Roles from "../pages/users/Roles";

// Marketing
import Coupons from "../pages/marketing/Coupons";
import FlashSales from "../pages/marketing/FlashSales";
import Banners from "../pages/marketing/Banners";
import Campaigns from "../pages/marketing/Campaigns";

// Other Pages
import Reviews from "../pages/Reviews";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import AdminProfile from "../pages/AdminProfile";
import Notifications from "../pages/Notifications";
import ActivityLogs from "../pages/ActivityLogs";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes - Public */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>
                    {/* Redirect root "/" → /dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Products */}
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />
                    <Route path="/products/:id" element={<ProductDetails />} />

                    {/* Categories */}
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/sub-categories" element={<SubCategories />} />

                    {/* Inventory */}
                    <Route path="/inventory" element={<Inventory />} />

                    {/* Orders */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />

                    {/* Customers */}
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/:id" element={<CustomerDetails />} />

                    {/* Users & Roles */}
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/roles" element={<Roles />} />

                    {/* Marketing */}
                    <Route path="/marketing/coupons" element={<Coupons />} />
                    <Route path="/marketing/flash-sales" element={<FlashSales />} />
                    <Route path="/marketing/banners" element={<Banners />} />
                    <Route path="/marketing/campaigns" element={<Campaigns />} />

                    {/* Misc */}
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<AdminProfile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/activity-logs" element={<ActivityLogs />} />
                </Route>
            </Route>

            {/* Error Pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AdminRoutes;
