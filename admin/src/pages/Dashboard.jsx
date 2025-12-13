// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DollarSign, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';
import { getOrders } from "../redux/slices/orderSlice";
import { getAdmins } from "../redux/slices/adminSlice";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

// Components
import StatCard from '../components/common/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import OrderStats from '../components/dashboard/OrderStats';
import TopProducts from '../components/dashboard/TopProducts';
import RecentOrders from '../components/dashboard/RecentOrders';
import RecentCustomers from '../components/dashboard/RecentCustomers';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Loader from '../components/common/Loader';

// Redux
import { fetchDashboardStats } from '../redux/slices/DashboardSlice';

const Dashboard = () => {
    const dispatch = useDispatch();

    // ✅ default the slice itself
    const dashboardSlice = useSelector((state) => state.dashboard || {});
    const { stats = {}, loading = false, error = null } = dashboardSlice;
    const { user } = useSelector((state) => state.auth || {});

    const [dateRange, setDateRange] = useState('week');

    useEffect(() => {
        dispatch(fetchDashboardStats(dateRange));
    }, [dispatch, dateRange]);

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Error Loading Dashboard</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const statsData = [
        {
            title: 'Total Revenue',
            value: `৳${stats.totalRevenue?.toLocaleString() || '0'}`,
            change: stats.revenueChange || 0,
            icon: DollarSign,
            color: 'blue',
            trend: (stats.revenueChange || 0) >= 0 ? 'up' : 'down',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders?.toLocaleString() || '0',
            change: stats.ordersChange || 0,
            icon: ShoppingCart,
            color: 'green',
            trend: (stats.ordersChange || 0) >= 0 ? 'up' : 'down',
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers?.toLocaleString() || '0',
            change: stats.customersChange || 0,
            icon: Users,
            color: 'purple',
            trend: (stats.customersChange || 0) >= 0 ? 'up' : 'down',
        },
        {
            title: 'Total Products',
            value: stats.totalProducts?.toLocaleString() || '0',
            change: stats.productsChange || 0,
            icon: Package,
            color: 'orange',
            trend: (stats.productsChange || 0) >= 0 ? 'up' : 'down',
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-gray-600">
                        Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
                    </p>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statsData.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SalesChart dateRange={dateRange} />
                <RevenueChart dateRange={dateRange} />
            </div>

            {/* Order Stats */}
            <OrderStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <RecentOrders />
                    <TopProducts />
                </div>
                <div className="space-y-6">
                    <LowStockAlert />
                    <RecentCustomers />
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
