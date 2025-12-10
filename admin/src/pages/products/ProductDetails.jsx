// src/pages/products/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../../config"; // adjust if your config path differs
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Trash, Edit } from "lucide-react";

const ProductDetails = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${backendUrl}/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch product details");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, token]);

    const deleteProduct = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${backendUrl}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Product deleted successfully");
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete product");
        }
    };

    if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
    if (!product) return <p className="p-4 text-red-500">Product not found</p>;

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/admin/products/edit/${id}`)}
                        className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                    >
                        <Edit className="h-4 w-4" /> Edit
                    </button>
                    <button
                        onClick={deleteProduct}
                        className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                    >
                        <Trash className="h-4 w-4" /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Image */}
                <div className="rounded border p-4">
                    <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        className="h-64 w-full object-contain"
                    />
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <p>
                        <span className="font-semibold">Price: </span>
                        {currency} {product.price}
                    </p>
                    <p>
                        <span className="font-semibold">Category: </span>
                        {product.category?.name || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Stock: </span>
                        {product.stock > 0 ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" /> In Stock
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-600">
                                <XCircle className="h-4 w-4" /> Out of Stock
                            </span>
                        )}
                    </p>
                    <p>
                        <span className="font-semibold">Description: </span>
                        {product.description || "No description"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
