// src/pages/inventory/Inventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config"; // Make sure backendUrl is exported from config

const Inventory = ({ token }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get(`${backendUrl}/inventory`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInventory(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch inventory");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [token]);

    const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);

    if (loading) return <div className="p-4">Loading inventory...</div>;

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Inventory</h1>

            {inventory.length === 0 ? (
                <p>No inventory items found.</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Product Name</th>
                            <th className="border p-2 text-left">SKU</th>
                            <th className="border p-2 text-left">Quantity</th>
                            <th className="border p-2 text-left">Low Stock Threshold</th>
                            <th className="border p-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item._id} className={item.quantity <= item.lowStockThreshold ? "bg-red-50" : "hover:bg-gray-50"}>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">{item.sku}</td>
                                <td className="border p-2">{item.quantity}</td>
                                <td className="border p-2">{item.lowStockThreshold}</td>
                                <td className="border p-2">
                                    {item.quantity <= item.lowStockThreshold ? (
                                        <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-600">Low Stock</span>
                                    ) : (
                                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">In Stock</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {lowStockItems.length > 0 && (
                <div className="mt-4 border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-800">
                    ⚠️ There are {lowStockItems.length} items low in stock!
                </div>
            )}
        </div>
    );
};

export default Inventory;
