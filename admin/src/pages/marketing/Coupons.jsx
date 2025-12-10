// src/pages/marketing/Coupons.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // Replace with your backend URL

const Coupons = ({ token }) => {
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({ code: "", discount: "" });
    const [loading, setLoading] = useState(true);

    // Fetch all coupons
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await axios.get(`${backendUrl}/coupons`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCoupons(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch coupons");
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, [token]);

    // Add new coupon
    const handleAddCoupon = async (e) => {
        e.preventDefault();
        if (!newCoupon.code || !newCoupon.discount)
            return toast.error("Please fill all fields");

        try {
            const res = await axios.post(
                `${backendUrl}/coupons`,
                { code: newCoupon.code, discount: Number(newCoupon.discount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCoupons((prev) => [...prev, res.data]);
            setNewCoupon({ code: "", discount: "" });
            toast.success("Coupon added");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add coupon");
        }
    };

    // Delete coupon
    const handleDeleteCoupon = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;

        try {
            await axios.delete(`${backendUrl}/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCoupons((prev) => prev.filter((c) => c._id !== id));
            toast.success("Coupon deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete coupon");
        }
    };

    if (loading) return <div className="p-4">Loading coupons...</div>;

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Coupons & Discounts</h1>

            {/* Add New Coupon */}
            <form onSubmit={handleAddCoupon} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="flex-1 rounded border p-2"
                />
                <input
                    type="number"
                    placeholder="Discount (%)"
                    value={newCoupon.discount}
                    onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discount: e.target.value })
                    }
                    className="w-32 rounded border p-2"
                />
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Add
                </button>
            </form>

            {/* Coupons List */}
            <div className="space-y-2">
                {coupons.length === 0 && <p>No coupons found.</p>}
                {coupons.map((coupon) => (
                    <div
                        key={coupon._id}
                        className="flex items-center justify-between rounded border p-3"
                    >
                        <span>
                            <strong>{coupon.code}</strong> - {coupon.discount}%
                        </span>
                        <button
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Coupons;
