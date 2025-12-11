// src/components/dashboard/LowStockAlert.jsx

import React from "react";

const LowStockAlert = () => {
    // Dummy data for now
    const lowStockProducts = [
        { id: 1, name: "Wireless Mouse", stock: 3 },
        { id: 2, name: "Gaming Keyboard", stock: 5 },
        { id: 3, name: "USB-C Cable", stock: 2 },
    ];

    return (
        <div className="rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold text-red-600">Low Stock Alerts</h2>
            <ul className="space-y-2">
                {lowStockProducts.map((product) => (
                    <li key={product.id} className="text-gray-700">
                        <span className="font-medium">{product.name}</span> – Only {product.stock} left!
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LowStockAlert;
