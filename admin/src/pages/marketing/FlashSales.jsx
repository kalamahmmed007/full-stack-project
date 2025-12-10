// src/pages/marketing/FlashSales.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config"; // Make sure this exists and exports backendUrl

const FlashSales = ({ token }) => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch flash sales from backend
    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const res = await axios.get(`${backendUrl}/flash-sales`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFlashSales(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch flash sales");
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSales();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this flash sale?")) return;

        try {
            await axios.delete(`${backendUrl}/flash-sales/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFlashSales(flashSales.filter((sale) => sale._id !== id));
            toast.success("Flash sale deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete flash sale");
        }
    };

    if (loading) return <div className="p-4">Loading flash sales...</div>;

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Flash Sales</h1>

            {flashSales.length === 0 ? (
                <p>No flash sales available.</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Title</th>
                            <th className="border p-2 text-left">Start Date</th>
                            <th className="border p-2 text-left">End Date</th>
                            <th className="border p-2 text-left">Discount (%)</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flashSales.map((sale) => (
                            <tr key={sale._id} className="hover:bg-gray-50">
                                <td className="border p-2">{sale.title}</td>
                                <td className="border p-2">{new Date(sale.startDate).toLocaleString()}</td>
                                <td className="border p-2">{new Date(sale.endDate).toLocaleString()}</td>
                                <td className="border p-2">{sale.discount}</td>
                                <td className="flex gap-2 border p-2">
                                    <button
                                        onClick={() => handleDelete(sale._id)}
                                        className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    {/* You can add an Edit button linking to an EditFlashSale page */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FlashSales;
