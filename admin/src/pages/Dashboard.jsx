import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    Activity,
    AlertTriangle,
    Calendar
} from 'lucide-react';

// Components
import StatCard from '../components/common/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
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
    const { stats, loading, error } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);

    const [dateRange, setDateRange] = useState('week'); // week, month, year

    useEffect(() => {
        dispatch(fetchDashboardStats(dateRange));
    }, [dispatch, dateRange]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Error Loading Dashboard</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const statsData = [
        {
            title: 'Total Revenue',
            value: `৳${stats?.totalRevenue?.toLocaleString() || '0'}`,
            change: stats?.revenueChange || 0,
            icon: DollarSign,
            color: 'blue',
            trend: stats?.revenueChange >= 0 ? 'up' : 'down'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders?.toLocaleString() || '0',
            change: stats?.ordersChange || 0,
            icon: ShoppingCart,
            color: 'green',
            trend: stats?.ordersChange >= 0 ? 'up' : 'down'
        },
        {
            title: 'Total Customers',
            value: stats?.totalCustomers?.toLocaleString() || '0',
            change: stats?.customersChange || 0,
            icon: Users,
            color: 'purple',
            trend: stats?.customersChange >= 0 ? 'up' : 'down'
        },
        {
            title: 'Total Products',
            value: stats?.totalProducts?.toLocaleString() || '0',
            change: stats?.productsChange || 0,
            icon: Package,
            color: 'orange',
            trend: stats?.productsChange >= 0 ? 'up' : 'down'
        }
    ];

    return (
        <div className="space-y-6 p-6">
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
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SalesChart dateRange={dateRange} />
                <RevenueChart dateRange={dateRange} />
            </div>

            {/* Order Stats */}
            <OrderStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - 2/3 width */}
                <div className="space-y-6 lg:col-span-2">
                    <RecentOrders />
                    <TopProducts />
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    <LowStockAlert />
                    <RecentCustomers />
                    <ActivityFeed />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50">
                        <Package className="mb-2 h-8 w-8 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Add Product</span>
                    </button>
                    <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-green-500 hover:bg-green-50">
                        <ShoppingCart className="mb-2 h-8 w-8 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">New Order</span>
                    </button>
                    <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-purple-500 hover:bg-purple-50">
                        <Users className="mb-2 h-8 w-8 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">Add Customer</span>
                    </button>
                    <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-orange-500 hover:bg-orange-50">
                        <Activity className="mb-2 h-8 w-8 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">View Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;