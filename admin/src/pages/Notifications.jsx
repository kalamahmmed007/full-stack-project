// src/pages/Notifications.jsx
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config"; // make sure this exists and exports backendUrl

const Notifications = ({ token }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${backendUrl}/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(res.data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch notifications");
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <Bell className="h-6 w-6 text-blue-600" />
                Notifications
            </h1>

            {loading ? (
                <p className="text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <p className="text-gray-500">No notifications available.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((notif) => (
                        <li
                            key={notif._id}
                            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
                        >
                            <div className="flex items-center gap-3">
                                {notif.read ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-800">{notif.title}</p>
                                    <p className="text-sm text-gray-500">{notif.message}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
