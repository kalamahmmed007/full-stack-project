const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const { range = 'week' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (range) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        // Total Revenue
        const orders = await Order.find({ createdAt: { $gte: startDate } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Previous period revenue for change calculation
        const prevStartDate = new Date(startDate);
        prevStartDate.setTime(prevStartDate.getTime() - (now - startDate));
        const prevOrders = await Order.find({
            createdAt: { $gte: prevStartDate, $lt: startDate }
        });
        const prevRevenue = prevOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const revenueChange = prevRevenue ? ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0;

        // Total Orders
        const totalOrders = orders.length;
        const prevOrdersCount = prevOrders.length;
        const ordersChange = prevOrdersCount ? ((totalOrders - prevOrdersCount) / prevOrdersCount * 100).toFixed(1) : 0;

        // Total Customers
        const totalCustomers = await User.countDocuments({ createdAt: { $gte: startDate } });
        const prevCustomers = await User.countDocuments({
            createdAt: { $gte: prevStartDate, $lt: startDate }
        });
        const customersChange = prevCustomers ? ((totalCustomers - prevCustomers) / prevCustomers * 100).toFixed(1) : 0;

        // Total Products
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ status: 'active' });
        const productsChange = 0; // Static for now

        // Order Stats by Status
        const orderStats = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        const orderStatusMap = {
            pending: { label: 'Pending', value: 0, color: 'bg-yellow-500' },
            processing: { label: 'Processing', value: 0, color: 'bg-blue-500' },
            delivered: { label: 'Delivered', value: 0, color: 'bg-green-500' },
            cancelled: { label: 'Cancelled', value: 0, color: 'bg-red-500' }
        };

        orderStats.forEach(stat => {
            if (orderStatusMap[stat._id]) {
                orderStatusMap[stat._id].value = stat.count;
            }
        });

        // Sales Chart Data
        const salesChart = [];
        const revenueChart = [];
        const daysInRange = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));

        for (let i = daysInRange - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayOrders = await Order.find({
                createdAt: { $gte: date, $lt: nextDate }
            });

            const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

            salesChart.push({
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                value: dayOrders.length
            });

            revenueChart.push({
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                value: dayRevenue
            });
        }

        // Recent Orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort('-createdAt')
            .limit(5);

        // Top Products
        const topProducts = await Product.find({ status: 'active' })
            .sort('-sold')
            .limit(5)
            .select('name sold price');

        const topProductsData = topProducts.map(product => ({
            name: product.name,
            sales: product.sold,
            revenue: product.sold * product.price
        }));

        // Recent Customers
        const recentCustomers = await User.find()
            .sort('-createdAt')
            .limit(5)
            .select('name email');

        const recentCustomersData = await Promise.all(
            recentCustomers.map(async (user) => {
                const orderCount = await Order.countDocuments({ user: user._id });
                return {
                    name: user.name,
                    email: user.email,
                    orders: orderCount
                };
            })
        );

        // Low Stock Products
        const lowStockItems = await Product.find({
            stock: { $lte: 10, $gt: 0 }
        })
            .limit(5)
            .select('name stock');

        const lowStockData = lowStockItems.map(item => ({
            name: item.name,
            stock: item.stock,
            threshold: 10
        }));

        // Recent Activities
        const recentActivities = [
            { text: 'New order placed', time: '5 min ago', type: 'order' },
            { text: 'Product stock updated', time: '15 min ago', type: 'stock' },
            { text: 'New customer registered', time: '1 hour ago', type: 'customer' }
        ];

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalRevenue,
                    revenueChange: parseFloat(revenueChange),
                    totalOrders,
                    ordersChange: parseFloat(ordersChange),
                    totalCustomers,
                    customersChange: parseFloat(customersChange),
                    totalProducts,
                    productsChange: parseFloat(productsChange)
                },
                salesChart,
                revenueChart,
                orderStats: Object.values(orderStatusMap),
                recentOrders: recentOrders.map(order => ({
                    _id: order._id,
                    customerName: order.user?.name,
                    email: order.user?.email,
                    amount: order.totalPrice,
                    status: order.orderStatus,
                    date: order.createdAt
                })),
                topProducts: topProductsData,
                recentCustomers: recentCustomersData,
                lowStockItems: lowStockData,
                activities: recentActivities
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

