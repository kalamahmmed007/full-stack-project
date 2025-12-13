import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/slices/orderSlice";
import useOrdersSocket from "../../hooks/useOrdersSocket";
import OrderTable from "./OrderTable";
import OrderStatus from "./OrderStatus";
import OrderTimeline from "./OrderTimeline";

const OrderList = () => {
    const dispatch = useDispatch();
    const orderState = useSelector((state) => state.order || {});
    const { orders = [], loading = false, error = null } = orderState;

    useOrdersSocket(true); // Socket connection for live updates

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {String(error)}</div>;

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-semibold">
                All Orders ({orders.length})
            </h2>

            {orders.map((order) => (
                <div key={order._id} className="p-4 mb-4 bg-white rounded shadow">
                    <OrderStatus status={order.status} orderId={order._id} />
                    <OrderTimeline timeline={order.timeline} />
                </div>
            ))}

            <OrderTable orders={orders} />
        </div>
    );
};

export default OrderList;
