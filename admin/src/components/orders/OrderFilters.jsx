import React from "react";

const OrderFilters = () => {
    return (
        <div className="flex gap-4 mb-4">
            <select className="p-2 border rounded">
                <option value="">All Status</option>
                <option>Processing</option>
                <option>Delivered</option>
                <option>Cancelled</option>
            </select>

            <input
                type="date"
                className="p-2 border rounded"
            />

            <input
                type="text"
                placeholder="Search order ID"
                className="p-2 border rounded"
            />
        </div>
    );
};

export default OrderFilters;
