// src/components/orders/OrderList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/slices/OrderSlice"; // make sure slice name matches store
import useOrdersSocket from "../../hooks/useOrdersSocket";
import OrderTable from "./OrderTable";
import OrderStatus from "./OrderStatus";
import OrderTimeline from "./OrderTimeline";

const OrderList = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orderSlice);
    // Ensure 'orderSlice' matches your Redux store key

    // Connect socket for realtime updates
    useOrdersSocket(true);

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {String(error)}</div>;

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-semibold">
                All Orders ({orders?.length || 0})
            </h2>
            {/* Render orders table */}
            <OrderTable orders={orders}>
                {/* Pass additional components for each order if needed */}
                {orders?.map(order => (
                    <div key={order._id} className="p-4 mb-4 bg-white rounded shadow">
                        <OrderStatus status={order.status} orderId={order._id} />
                        <OrderTimeline timeline={order.timeline} />
                    </div>
                ))}
            </OrderTable>
        </div>
    );
};

export default OrderList;
