// src/pages/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // replace with your API URL

const AdminProfile = ({ token }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${backendUrl}/admin/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAdmin(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch admin profile");
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, [token]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!admin) return <div className="p-4">No profile data found.</div>;

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Admin Profile</h1>
            <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                <div>
                    <strong>Name:</strong> {admin.name}
                </div>
                <div>
                    <strong>Email:</strong> {admin.email}
                </div>
                <div>
                    <strong>Role:</strong> {admin.role}
                </div>
                <div>
                    <strong>Joined:</strong> {new Date(admin.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
