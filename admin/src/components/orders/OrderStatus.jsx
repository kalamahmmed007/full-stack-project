import React from "react";

const OrderStatus = ({ status }) => {
    const getStatusColor = () => {
        if (status === "Delivered") return "bg-green-500";
        if (status === "Processing") return "bg-yellow-500";
        return "bg-gray-400";
    };

    return (
        <span className={`px-2 py-1 text-white rounded ${getStatusColor()}`}>
            {status}
        </span>
    );
};

export default OrderStatus;
