// src/pages/orders/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config";
import { CheckCircle, XCircle, Truck, Clock } from "lucide-react";

const OrderDetails = ({ token }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${backendUrl}/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrder(res.data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch order details");
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, token]);

    if (loading) return <p className="p-6 text-gray-500">Loading order details...</p>;
    if (!order) return <p className="p-6 text-red-500">Order not found.</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                &larr; Back to Orders
            </button>

            <h1 className="mb-4 text-2xl font-bold">Order #{order._id}</h1>

            <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <h2 className="mb-2 text-lg font-semibold">Customer Details</h2>
                <p><span className="font-medium">Name:</span> {order.customerName}</p>
                <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
            </div>

            <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <h2 className="mb-2 text-lg font-semibold">Order Status</h2>
                <div className="flex items-center gap-2">
                    {order.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {order.status === "shipped" && <Truck className="h-5 w-5 text-blue-500" />}
                    {order.status === "delivered" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {order.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}
                    <span className="capitalize">{order.status}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-2 text-lg font-semibold">Products</h2>
                <ul className="divide-y divide-gray-200">
                    {order.products.map((product) => (
                        <li key={product._id} className="flex items-center justify-between py-2">
                            <span>{product.name} x {product.quantity}</span>
                            <span>${product.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
