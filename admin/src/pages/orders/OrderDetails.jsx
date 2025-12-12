import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getOrder,
    changeOrderStatus,
    updateOrderRealtime,
} from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Truck, Clock } from "lucide-react";
import { io } from "socket.io-client";
import { backendUrl } from "../../config";
import OrderStatus from "../../components/orders/OrderStatus";
import OrderTimeline from "../../components/orders/OrderTimeline";
import InvoiceGenerator from "../../components/orders/InvoiceGenerator";
import RefundForm from "../../components/orders/RefundForm";
import TrackingInfo from "../../components/orders/TrackingInfo";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedOrder: order, loading, error } = useSelector(
        (state) => state.Order
    );

    // Fetch order on mount
    useEffect(() => {
        if (orderId) dispatch(getOrder(orderId));
    }, [dispatch, orderId]);

    // Socket for live updates
    useEffect(() => {
        if (!orderId) return;

        const socket = io(backendUrl, { transports: ["websocket"] });
        socket.emit("join_order_room", orderId);

        socket.on("order_status_updated", (updatedOrder) => {
            if (updatedOrder._id === orderId) {
                dispatch(updateOrderRealtime(updatedOrder));
                toast.info(`Order status updated to ${updatedOrder.status}`);
            }
        });

        return () => socket.disconnect();
    }, [dispatch, orderId]);

    // Status change handler
    const handleStatusChange = (status) => {
        dispatch(changeOrderStatus({ id: orderId, status }))
            .unwrap()
            .then(() => toast.success("Order status updated"))
            .catch(() => toast.error("Failed to update status"));
    };

    if (loading || !order)
        return <p className="p-6 text-gray-500">Loading order details...</p>;

    if (error)
        return <p className="p-6 text-red-500">Failed: {String(error)}</p>;

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                &larr; Back to Orders
            </button>

            <h1 className="mb-4 text-2xl font-bold">Order #{order._id}</h1>

            {/* CUSTOMER DETAILS */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 className="mb-2 text-lg font-semibold">Customer Details</h2>
                <p>
                    <span className="font-medium">Name:</span> {order.customerName}
                </p>
                <p>
                    <span className="font-medium">Email:</span> {order.customerEmail}
                </p>
                <p>
                    <span className="font-medium">Phone:</span> {order.customerPhone}
                </p>
            </div>

            {/* ORDER STATUS */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 className="mb-2 text-lg font-semibold">Order Status</h2>
                <div className="flex items-center gap-2">
                    {order.status === "pending" && <Clock className="w-5 h-5 text-yellow-500" />}
                    {order.status === "processing" && <Clock className="w-5 h-5 text-yellow-500" />}
                    {order.status === "shipped" && <Truck className="w-5 h-5 text-blue-500" />}
                    {order.status === "delivered" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {order.status === "cancelled" && <XCircle className="w-5 h-5 text-red-500" />}
                    <span className="capitalize">{order.status}</span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    Ordered at: {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3 mt-4">
                    {["processing", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`px-3 py-1 text-white rounded ${status === "processing"
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : status === "shipped"
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : status === "delivered"
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* PRODUCTS LIST */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 className="mb-2 text-lg font-semibold">Products</h2>
                <ul className="divide-y divide-gray-200">
                    {order.products?.map((product) => (
                        <li
                            key={product._id}
                            className="flex items-center justify-between py-2"
                        >
                            <span>
                                {product.name} x {product.quantity}
                            </span>
                            <span>${product.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between mt-4 font-semibold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>

            {/* ADDITIONAL COMPONENTS */}
            <div className="space-y-6">
                <OrderTimeline order={order} />
                <OrderStatus order={order} onStatusChange={handleStatusChange} />
                <InvoiceGenerator order={order} />
                <RefundForm order={order} />
                <TrackingInfo order={order} />
            </div>
        </div>
    );
};

export default OrderDetails;
