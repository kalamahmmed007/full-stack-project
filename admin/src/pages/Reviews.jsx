// src/pages/Reviews.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config"; // adjust if your config path is different
import { toast } from "react-toastify";
import { Star, Trash2 } from "lucide-react";

const Reviews = ({ token }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/reviews`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch reviews");
            setLoading(false);
        }
    };

    const deleteReview = async (id) => {
        try {
            await axios.delete(`${backendUrl}/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Review deleted");
            setReviews(reviews.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete review");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 text-2xl font-bold">Product Reviews</h1>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500">No reviews found.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="flex items-start justify-between rounded-lg bg-white p-4 shadow"
                        >
                            <div>
                                <p className="font-semibold">{review.userName}</p>
                                <p className="text-sm text-gray-500">{review.productName}</p>
                                <div className="mt-1 flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                            </div>
                            <button
                                onClick={() => deleteReview(review._id)}
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

export default Reviews;
