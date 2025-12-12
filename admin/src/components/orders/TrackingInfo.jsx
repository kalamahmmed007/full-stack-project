// src/components/tracking/TrackingInfo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config";

const TrackingInfo = ({ orderId, token }) => {
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch tracking info
    const fetchTracking = async () => {
        if (!orderId || !token) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `${backendUrl}/api/order/tracking/${orderId}`,
                { headers: { token } }
            );

            if (response.data.success) {
                setTracking(response.data.tracking);
            } else {
                toast.error(response.data.message || "Failed to fetch tracking info");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracking();
    }, [orderId]);

    if (loading) return <p className="p-4 text-gray-500">Loading tracking info...</p>;
    if (!tracking) return <p className="p-4 text-gray-500">No tracking info available.</p>;

    return (
        <div className="max-w-2xl p-6 mx-auto mt-6 bg-white rounded shadow">
            <h2 className="mb-4 text-xl font-bold">Tracking Information</h2>

            <div className="space-y-4">
                <p>
                    <span className="font-semibold">Order ID:</span> {orderId}
                </p>
                <p>
                    <span className="font-semibold">Carrier:</span> {tracking.carrier}
                </p>
                <p>
                    <span className="font-semibold">Tracking Number:</span> {tracking.trackingNumber}
                </p>
                <p>
                    <span className="font-semibold">Status:</span> {tracking.status}
                </p>

                <h3 className="mt-4 text-lg font-semibold">Timeline</h3>
                <ul className="ml-4 border-l-2 border-gray-300">
                    {tracking.events?.map((event, idx) => (
                        <li key={idx} className="pl-4 mb-2">
                            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                            <p className="font-medium">{event.status}</p>
                            {event.note && <p className="text-gray-700">{event.note}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TrackingInfo;
