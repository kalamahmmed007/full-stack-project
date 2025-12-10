// src/pages/products/EditProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // Replace with your backend URL

const EditProduct = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${backendUrl}/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${backendUrl}/products/${id}`, product, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Product updated successfully");
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update product");
        }
    };

    if (loading) return <div className="p-4">Loading product...</div>;

    return (
        <div className="mx-auto max-w-2xl p-4">
            <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block font-medium">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        rows="4"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-1 block font-medium">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
