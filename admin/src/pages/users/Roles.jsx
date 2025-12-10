// src/pages/users/Roles.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../config"; // adjust if your config path is different
import { toast } from "react-toastify";
import { Shield, Trash2, Plus } from "lucide-react";

const Roles = ({ token }) => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch roles");
            setLoading(false);
        }
    };

    const addRole = async () => {
        if (!newRole) return toast.error("Role name is required");
        try {
            const res = await axios.post(
                `${backendUrl}/roles`,
                { name: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoles([...roles, res.data]);
            setNewRole("");
            toast.success("Role added");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add role");
        }
    };

    const deleteRole = async (id) => {
        try {
            await axios.delete(`${backendUrl}/roles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(roles.filter((r) => r._id !== id));
            toast.success("Role deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete role");
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                <Shield className="h-6 w-6" /> User Roles & Permissions
            </h1>

            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="New Role Name"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={addRole}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" /> Add
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : roles.length === 0 ? (
                <p className="text-gray-500">No roles found.</p>
            ) : (
                <div className="space-y-4">
                    {roles.map((role) => (
                        <div
                            key={role._id}
                            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
                        >
                            <span className="font-medium">{role.name}</span>
                            <button
                                onClick={() => deleteRole(role._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Roles;
