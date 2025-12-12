// src/components/orders/OrderTable.jsx
import React, { useState, useEffect } from "react";

const OrderTable = ({ orders }) => {
    const [highlightId, setHighlightId] = useState(null);

    useEffect(() => {
        if (orders.length > 0) {
            const latestOrderId = orders[0]._id; // assume newest order is at index 0
            setHighlightId(latestOrderId);

            const timer = setTimeout(() => setHighlightId(null), 3000); // highlight 3s
            return () => clearTimeout(timer);
        }
    }, [orders]);

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <div
                    key={order._id}
                    className={`p-4 border rounded shadow transition-colors duration-500 ${highlightId === order._id ? "bg-green-100 animate-pulse" : "bg-white"
                        }`}
                >
                    <p>
                        <strong>#{order._id}</strong> — {order.customerName} — {order.status}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default OrderTable;
