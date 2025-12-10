// src/pages/categories/Categories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // Replace with your backend URL

const Categories = ({ token }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${backendUrl}/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [token]);

    // Add new category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return toast.error("Category name is required");

        try {
            const res = await axios.post(
                `${backendUrl}/categories`,
                { name: newCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategories((prev) => [...prev, res.data]);
            setNewCategory("");
            toast.success("Category added");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add category");
        }
    };

    // Delete category
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await axios.delete(`${backendUrl}/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories((prev) => prev.filter((c) => c._id !== id));
            toast.success("Category deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete category");
        }
    };

    if (loading) return <div className="p-4">Loading categories...</div>;

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Categories</h1>

            {/* Add New Category */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                    type="text"
                    placeholder="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 rounded border p-2"
                />
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Add
                </button>
            </form>

            {/* Category List */}
            <div className="space-y-2">
                {categories.length === 0 && <p>No categories found.</p>}
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="flex items-center justify-between rounded border p-3"
                    >
                        <span className="font-medium">{category.name}</span>
                        <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
