const RecentOrder = () => {
    const orders = [
        {
            id: "#ORD-1023",
            customer: "Rahim",
            amount: "৳2,500",
            status: "Delivered",
        },
        {
            id: "#ORD-1024",
            customer: "Karim",
            amount: "৳1,200",
            status: "Processing",
        },
        {
            id: "#ORD-1025",
            customer: "Ayesha",
            amount: "৳3,800",
            status: "Pending",
        },
        {
            id: "#ORD-1026",
            customer: "Nusrat",
            amount: "৳950",
            status: "Cancelled",
        },
    ];

    const statusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-600 bg-green-100";
            case "Processing":
                return "text-blue-600 bg-blue-100";
            case "Pending":
                return "text-yellow-600 bg-yellow-100";
            case "Cancelled":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">Recent Orders</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b text-left text-gray-500">
                        <tr>
                            <th className="pb-2">Order ID</th>
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b last:border-0">
                                <td className="py-2 font-medium">{order.id}</td>
                                <td className="py-2">{order.customer}</td>
                                <td className="py-2">{order.amount}</td>
                                <td className="py-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrder;
