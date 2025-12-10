import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // replace with your API URL

const Banner = ({ token }) => {
    const [banners, setBanners] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get(`${backendUrl}/banners`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBanners(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch banners");
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, [token]);

    // Handle banner upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return toast.error("Please select an image");

        const formData = new FormData();
        formData.append("image", image);

        try {
            const res = await axios.post(`${backendUrl}/banners`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            setBanners(prev => [...prev, res.data]);
            toast.success("Banner uploaded successfully");
            setImage(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload banner");
        }
    };

    if (loading) return <div className="p-4">Loading banners...</div>;

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Manage Banners</h1>

            {/* Upload Banner */}
            <form onSubmit={handleUpload} className="space-y-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full rounded border p-2"
                />
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Upload Banner
                </button>
            </form>

            {/* Banner List */}
            <div className="grid grid-cols-3 gap-4">
                {banners.length === 0 && <p>No banners found</p>}
                {banners.map((banner) => (
                    <div key={banner._id} className="overflow-hidden rounded border">
                        <img src={banner.imageUrl} alt="Banner" className="h-40 w-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;