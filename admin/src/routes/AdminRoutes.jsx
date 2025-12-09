// src/routes/AdminRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import AdminLayout from "../components/common/AdminLayout";

// Auth Pages
const Login = lazy(() => import("../pages/Login"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

// Dashboard
const Dashboard = lazy(() => import("../pages/Dashboard"));

// Products
const Products = lazy(() => import("../pages/Products"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const EditProduct = lazy(() => import("../pages/EditProduct"));

// Categories
const Categories = lazy(() => import("../pages/Categories"));

// Orders
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));

// Users
const Users = lazy(() => import("../pages/Users"));
const UserDetails = lazy(() => import("../pages/UserDetails"));

// Coupons
const Coupons = lazy(() => import("../pages/Coupons"));

// Reviews
const Reviews = lazy(() => import("../pages/Reviews"));

// Reports
const Reports = lazy(() => import("../pages/Reports"));

// Settings
const Settings = lazy(() => import("../pages/Settings"));

// Profile
const AdminProfile = lazy(() => import("../pages/AdminProfile"));

// 404
const NotFound = lazy(() => import("../pages/NotFound"));

const AdminRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {/* Public Routes */}
                <Route path="login" element={<Login />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        {/* Dashboard */}
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Products */}
                        <Route path="products">
                            <Route index element={<Products />} />
                            <Route path="add" element={<AddProduct />} />
                            <Route path="edit/:id" element={<EditProduct />} />
                            <Route path="bulk-upload" element={<AddProduct />} />
                            <Route path=":id/variants" element={<EditProduct />} />
                        </Route>

                        {/* Categories */}
                        <Route path="categories">
                            <Route index element={<Categories />} />
                            <Route path="add" element={<Categories />} />
                            <Route path="edit/:id" element={<Categories />} />
                        </Route>

                        {/* Orders */}
                        <Route path="orders">
                            <Route index element={<Orders />} />
                            <Route path=":id" element={<OrderDetails />} />
                            <Route path=":id/invoice" element={<OrderDetails />} />
                            <Route path=":id/update-status" element={<OrderDetails />} />
                        </Route>

                        {/* Users */}
                        <Route path="users">
                            <Route index element={<Users />} />
                            <Route path="add" element={<Users />} />
                            <Route path=":id" element={<UserDetails />} />
                            <Route path="edit/:id" element={<Users />} />
                            <Route path=":id/activity" element={<UserDetails />} />
                        </Route>

                        {/* Coupons */}
                        <Route path="coupons">
                            <Route index element={<Coupons />} />
                            <Route path="add" element={<Coupons />} />
                            <Route path="edit/:id" element={<Coupons />} />
                        </Route>

                        {/* Reviews */}
                        <Route path="reviews">
                            <Route index element={<Reviews />} />
                            <Route path="pending" element={<Reviews />} />
                            <Route path=":id" element={<Reviews />} />
                        </Route>

                        {/* Reports */}
                        <Route path="reports">
                            <Route index element={<Reports />} />
                            <Route path="sales" element={<Reports />} />
                            <Route path="inventory" element={<Reports />} />
                            <Route path="customers" element={<Reports />} />
                            <Route path="revenue" element={<Reports />} />
                        </Route>

                        {/* Settings */}
                        <Route path="settings">
                            <Route index element={<Settings />} />
                            <Route path="general" element={<Settings />} />
                            <Route path="payment" element={<Settings />} />
                            <Route path="shipping" element={<Settings />} />
                            <Route path="email" element={<Settings />} />
                            <Route path="seo" element={<Settings />} />
                            <Route path="tax" element={<Settings />} />
                        </Route>

                        {/* Profile */}
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="profile/change-password" element={<AdminProfile />} />

                        {/* 404 Not Found */}
                        <Route path="404" element={<NotFound />} />
                    </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="404" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;
