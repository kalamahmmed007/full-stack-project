// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config"; // adjust path if needed
import { toast } from "react-toastify";
import { Settings, Package, CreditCard, Truck, Mail, MessageSquare } from "lucide-react";

const SettingsPage = ({ token }) => {
    const [settings, setSettings] = useState({
        siteName: "",
        storeEmail: "",
        currency: "USD",
        shippingMethod: "",
        paymentGateway: ""
    });
    const [loading, setLoading] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/settings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSettings(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch settings");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${backendUrl}/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Settings updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                <Settings className="h-6 w-6" /> Settings
            </h1>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Site Name</label>
                        <input
                            type="text"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Store Email</label>
                        <input
                            type="email"
                            name="storeEmail"
                            value={settings.storeEmail}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Currency</label>
                        <select
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="BDT">BDT</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Shipping Method</label>
                        <input
                            type="text"
                            name="shippingMethod"
                            value={settings.shippingMethod}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Payment Gateway</label>
                        <input
                            type="text"
                            name="paymentGateway"
                            value={settings.paymentGateway}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                    >
                        <Settings className="h-5 w-5" /> Save Settings
                    </button>
                </form>
            )}
        </div>
    );
};

export default SettingsPage;
