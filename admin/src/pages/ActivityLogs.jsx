// src/pages/users/ActivityLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config"; // make sure your config.js has backendUrl
import { toast } from "react-toastify";

const ActivityLogs = ({ token }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/activity-logs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLogs(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load activity logs");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-4 text-2xl font-bold">Activity Logs</h1>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : logs.length === 0 ? (
                <p className="text-gray-500">No activity logs found.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    IP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td className="whitespace-nowrap px-6 py-4">{log.userName}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{log.action}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActivityLogs;
