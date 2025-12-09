// ============================================
// pages/Dashboard.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ShoppingCart,
    DollarSign,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    Eye,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

// Import dashboard components
import SalesChart from '../components/dashboard/SalesChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import OrderStats from '../components/dashboard/OrderStats';
import TopProducts from '../components/dashboard/TopProducts';
import RecentOrders from '../components/dashboard/RecentOrders';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days, year
    const [loading, setLoading] = useState(false);

    // Mock data - Replace with Redux state
    const dashboardStats = {
        totalRevenue: 125680,
        revenueChange: 12.5,
        totalOrders: 1284,
        ordersChange: 8.2,
        totalCustomers: 3456,
        customersChange: 15.3,
        totalProducts: 892,
        productsChange: -2.1,
        pendingOrders: 45,
        processingOrders: 28,
        shippedOrders: 156,
        deliveredOrders: 1055
    };

    const recentOrders = [
        {
            id: '#ORD-001',
            customer: 'John Doe',
            product: 'Casual Checked Shirt',
            amount: 1290,
            status: 'pending',
            date: '2024-12-09'
        },
        {
            id: '#ORD-002',
            customer: 'Jane Smith',
            product: 'Designer Polo',
            amount: 990,
            status: 'shipped',
            date: '2024-12-08'
        },
        {
            id: '#ORD-003',
            customer: 'Mike Johnson',
            product: 'Luxury Panjabi',
            amount: 2990,
            status: 'delivered',
            date: '2024-12-07'
        },
        {
            id: '#ORD-004',
            customer: 'Sarah Wilson',
            product: 'Striped Shirt',
            amount: 1290,
            status: 'processing',
            date: '2024-12-07'
        },
        {
            id: '#ORD-005',
            customer: 'Tom Brown',
            product: 'Tar Printed Shirt',
            amount: 1480,
            status: 'pending',
            date: '2024-12-06'
        }
    ];

    const topProducts = [
        {
            id: 1,
            name: 'Casual Checked Shirt',
            category: 'Shirts',
            sales: 245,
            revenue: 316050,
            image: '/products/shirt1.jpg',
            trend: 'up',
            trendValue: 12
        },
        {
            id: 2,
            name: 'Luxury Panjabi',
            category: 'Panjabi',
            sales: 189,
            revenue: 565110,
            image: '/products/panjabi1.jpg',
            trend: 'up',
            trendValue: 8
        },
        {
            id: 3,
            name: 'Designer Polo',
            category: 'Polo',
            sales: 167,
            revenue: 165330,
            image: '/products/polo1.jpg',
            trend: 'down',
            trendValue: -3
        },
        {
            id: 4,
            name: 'Tar Printed Shirt',
            category: 'Shirts',
            sales: 134,
            revenue: 198320,
            image: '/products/shirt2.jpg',
            trend: 'up',
            trendValue: 5
        }
    ];

    useEffect(() => {
        // Fetch dashboard data
        fetchDashboardData();
    }, [timeRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // API call to fetch dashboard data
            // const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
            // const data = await response.json();
            // dispatch(setDashboardData(data));

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            processing: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const StatCard = ({ title, value, change, icon: Icon, color, loading }) => (
        <div className="p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse">
                    <div className="w-24 h-8 mb-2 bg-gray-200 rounded"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
            ) : (
                <>
                    <h3 className="mb-1 text-2xl font-bold text-gray-900">
                        {typeof value === 'number' && title.includes('Revenue')
                            ? `৳${value.toLocaleString()}`
                            : value.toLocaleString()}
                    </h3>
                    <div className="flex items-center text-sm">
                        <span className="mr-2 text-gray-600">{title}</span>
                        {change !== undefined && (
                            <span className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {Math.abs(change)}%
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-gray-600">Welcome back! Here's what's happening with your store.</p>
                </div>

                {/* Time Range Filter */}
                <div className="flex items-center space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={dashboardStats.totalRevenue}
                    change={dashboardStats.revenueChange}
                    icon={DollarSign}
                    color="bg-green-500"
                    loading={loading}
                />
                <StatCard
                    title="Total Orders"
                    value={dashboardStats.totalOrders}
                    change={dashboardStats.ordersChange}
                    icon={ShoppingCart}
                    color="bg-blue-500"
                    loading={loading}
                />
                <StatCard
                    title="Total Customers"
                    value={dashboardStats.totalCustomers}
                    change={dashboardStats.customersChange}
                    icon={Users}
                    color="bg-purple-500"
                    loading={loading}
                />
                <StatCard
                    title="Total Products"
                    value={dashboardStats.totalProducts}
                    change={dashboardStats.productsChange}
                    icon={Package}
                    color="bg-orange-500"
                    loading={loading}
                />
            </div>

            {/* Order Status Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-800">{dashboardStats.pendingOrders}</p>
                        </div>
                        <div className="p-2 bg-yellow-200 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Processing</p>
                            <p className="text-2xl font-bold text-blue-800">{dashboardStats.processingOrders}</p>
                        </div>
                        <div className="p-2 bg-blue-200 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Shipped</p>
                            <p className="text-2xl font-bold text-purple-800">{dashboardStats.shippedOrders}</p>
                        </div>
                        <div className="p-2 bg-purple-200 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Delivered</p>
                            <p className="text-2xl font-bold text-green-800">{dashboardStats.deliveredOrders}</p>
                        </div>
                        <div className="p-2 bg-green-200 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales Chart */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            View Details
                        </button>
                    </div>
                    <SalesChart />
                </div>

                {/* Revenue Chart */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            View Details
                        </button>
                    </div>
                    <RevenueChart />
                </div>
            </div>

            {/* Top Products and Recent Orders */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Products */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View All <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {topProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 transition-colors rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                                        <Package className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{product.sales} sales</p>
                                    <div className="flex items-center justify-end">
                                        <span className={`text-xs flex items-center ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {Math.abs(product.trendValue)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View All <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center mb-1 space-x-2">
                                        <p className="font-medium text-gray-900">{order.id}</p>
                                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{order.customer}</p>
                                    <p className="mt-1 text-xs text-gray-500">{order.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">৳{order.amount.toLocaleString()}</p>
                                    <button className="mt-1 text-sm text-blue-600 hover:text-blue-700">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <button
                        onClick={() => navigate('/admin/products/add')}
                        className="p-4 text-center transition-all border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 group"
                    >
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Add Product</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-4 text-center transition-all border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 group"
                    >
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Manage Orders</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/users')}
                        className="p-4 text-center transition-all border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 group"
                    >
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">View Customers</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/reports')}
                        className="p-4 text-center transition-all border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 group"
                    >
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">View Reports</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;