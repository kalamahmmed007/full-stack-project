// src/components/refund/RefundForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config";

const RefundForm = ({ token }) => {
    const [formData, setFormData] = useState({
        orderId: "",
        amount: "",
        reason: "",
    });
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.orderId || !formData.amount || !formData.reason) {
            return toast.error("All fields are required");
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${backendUrl}/api/refund`,
                {
                    orderId: formData.orderId,
                    amount: formData.amount,
                    reason: formData.reason,
                },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Refund request submitted successfully!");
                setFormData({ orderId: "", amount: "", reason: "" });
            } else {
                toast.error(response.data.message || "Failed to submit refund");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md p-6 mx-auto mt-8 bg-white rounded shadow">
            <h2 className="mb-4 text-xl font-bold">Refund Request Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Order ID</label>
                    <input
                        type="text"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter order ID"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Refund Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter refund amount"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Reason</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter reason for refund"
                        rows={4}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit Refund"}
                </button>
            </form>
        </div>
    );
};

export default RefundForm;
