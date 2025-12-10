// src/pages/products/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../../config"; // adjust if your config path differs
import { toast } from "react-toastify";
import { Edit, Trash, Eye } from "lucide-react";

const Products = ({ token }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${backendUrl}/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch products");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${backendUrl}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Product deleted successfully");
            setProducts(products.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete product");
        }
    };

    if (loading) return <p className="p-4 text-gray-500">Loading products...</p>;

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>
                <button
                    onClick={() => navigate("/admin/products/add")}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Add Product
                </button>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full rounded border border-gray-200 text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border-b px-4 py-2">Image</th>
                                <th className="border-b px-4 py-2">Name</th>
                                <th className="border-b px-4 py-2">Price</th>
                                <th className="border-b px-4 py-2">Stock</th>
                                <th className="border-b px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="border-b px-4 py-2">
                                        <img
                                            src={product.image || "/placeholder.png"}
                                            alt={product.name}
                                            className="h-12 w-12 object-contain"
                                        />
                                    </td>
                                    <td className="border-b px-4 py-2">{product.name}</td>
                                    <td className="border-b px-4 py-2">
                                        {currency} {product.price}
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        {product.stock > 0 ? (
                                            <span className="text-green-600">In Stock</span>
                                        ) : (
                                            <span className="text-red-600">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="flex gap-2 border-b px-4 py-2">
                                        <button
                                            onClick={() => navigate(`/admin/products/${product._id}`)}
                                            className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                                        >
                                            <Eye className="h-4 w-4" /> View
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                            className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                                        >
                                            <Edit className="h-4 w-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                                        >
                                            <Trash className="h-4 w-4" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Products;
