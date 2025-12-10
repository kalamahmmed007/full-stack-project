// src/pages/categories/SubCategories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../config"; // adjust path if needed
import { toast } from "react-toastify";
import { Plus, Trash } from "lucide-react";

const SubCategories = ({ token }) => {
    const [subCategories, setSubCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch subcategories
    const fetchSubCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/subcategories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubCategories(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch subcategories");
            setLoading(false);
        }
    };

    // Add subcategory
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name) return toast.warn("Subcategory name required");
        try {
            const res = await axios.post(
                `${backendUrl}/subcategories`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubCategories([...subCategories, res.data]);
            setName("");
            toast.success("Subcategory added");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add subcategory");
        }
    };

    // Delete subcategory
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendUrl}/subcategories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubCategories(subCategories.filter((sc) => sc._id !== id));
            toast.success("Subcategory deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete subcategory");
        }
    };

    useEffect(() => {
        fetchSubCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 text-2xl font-bold">SubCategories</h1>

            {/* Add Subcategory */}
            <form onSubmit={handleAdd} className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="New subcategory name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" /> Add
                </button>
            </form>

            {/* Subcategories List */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : subCategories.length === 0 ? (
                <p className="text-gray-500">No subcategories found.</p>
            ) : (
                <ul className="space-y-2">
                    {subCategories.map((sc) => (
                        <li
                            key={sc._id}
                            className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm"
                        >
                            <span>{sc.name}</span>
                            <button
                                onClick={() => handleDelete(sc._id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubCategories;
