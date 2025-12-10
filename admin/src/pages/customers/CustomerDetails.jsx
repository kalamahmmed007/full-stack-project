import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // Replace with your backend URL

const CustomerDetails = ({ token }) => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const [customerRes, ordersRes] = await Promise.all([
                    axios.get(`${backendUrl}/customers/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${backendUrl}/orders/customer/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setCustomer(customerRes.data);
                setOrders(ordersRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch customer details");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerDetails();
    }, [id, token]);

    if (loading) return <div className="p-4">Loading customer details...</div>;
    if (!customer) return <div className="p-4 text-red-600">Customer not found</div>;

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-gray-500">{customer.email}</p>
            <p className="text-gray-500">{customer.phone}</p>
            <p className="text-gray-500">Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>

            {/* Orders Section */}
            <div>
                <h2 className="mb-2 text-xl font-semibold">Orders</h2>
                {orders.length === 0 ? (
                    <p>No orders found for this customer.</p>
                ) : (
                    <div className="space-y-2">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between rounded border p-3"
                            >
                                <div>
                                    <p className="font-semibold">Order #{order._id}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Total: ${order.total.toFixed(2)}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Section */}
            {customer.activity && customer.activity.length > 0 && (
                <div>
                    <h2 className="mb-2 text-xl font-semibold">Activity Log</h2>
                    <div className="space-y-2">
                        {customer.activity.map((act, idx) => (
                            <div key={idx} className="rounded border p-2 text-sm text-gray-600">
                                <p>{act.action}</p>
                                <p className="text-xs text-gray-400">{new Date(act.date).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDetails;