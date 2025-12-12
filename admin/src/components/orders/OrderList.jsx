// src/components/orders/OrderList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/slices/OrderSlice";
import useOrdersSocket from "../../hooks/useOrdersSocket";
import OrderTable from "./OrderTable";

const OrderList = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.Order); // ensure key matches store

    // connect socket for realtime updates
    useOrdersSocket(true);

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {String(error)}</div>;

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-semibold">All Orders ({orders?.length || 0})</h2>
            <OrderTable orders={orders} />
        </div>
    );
};

export default OrderList;
