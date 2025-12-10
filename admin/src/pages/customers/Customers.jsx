// src/pages/customers/Customers.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // Replace with your backend URL

const Customers = ({ token }) => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get(`${backendUrl}/customers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomers(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch customers");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [token]);

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-4">Loading customers...</div>;

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Customers</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 w-full rounded border p-2"
            />

            {/* Customer Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Email</th>
                            <th className="border px-4 py-2 text-left">Phone</th>
                            <th className="border px-4 py-2 text-left">Joined</th>
                            <th className="border px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-4 text-center">
                                    No customers found.
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{customer.name}</td>
                                    <td className="border px-4 py-2">{customer.email}</td>
                                    <td className="border px-4 py-2">{customer.phone || "-"}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <Link
                                            to={`/admin/customers/${customer._id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
