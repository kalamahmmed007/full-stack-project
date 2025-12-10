// src/pages/users/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../config"; // make sure this exists
import { toast } from "react-toastify";
import { Users as UsersIcon, UserCog } from "lucide-react";

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${backendUrl}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p className="mt-10 text-center">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <UsersIcon className="h-6 w-6" /> Admin Users
            </h1>
            <div className="overflow-x-auto rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                                <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                <td className="flex items-center gap-1 whitespace-nowrap px-6 py-4">
                                    <UserCog className="h-4 w-4" /> {user.role}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.active ? (
                                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                                            Inactive
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
