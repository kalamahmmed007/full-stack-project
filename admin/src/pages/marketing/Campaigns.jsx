import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000"; // replace with your backend API

const Campaign = ({ token }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("email"); // "email" or "sms"
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch existing campaigns
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await axios.get(`${backendUrl}/campaigns`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCampaigns(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch campaigns");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [token]);

    // Handle creating new campaign
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return toast.error("All fields are required");

        try {
            const res = await axios.post(
                `${backendUrl}/campaigns`,
                { title, type, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCampaigns((prev) => [...prev, res.data]);
            toast.success("Campaign created successfully");
            setTitle("");
            setContent("");
            setType("email");
        } catch (err) {
            console.error(err);
            toast.error("Failed to create campaign");
        }
    };

    if (loading) return <div className="p-4">Loading campaigns...</div>;

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Manage Campaigns</h1>

            {/* New Campaign Form */}
            <form onSubmit={handleSubmit} className="space-y-2 rounded border p-4">
                <input
                    type="text"
                    placeholder="Campaign Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded border p-2"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded border p-2"
                >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                </select>
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-24 w-full rounded border p-2"
                ></textarea>
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Create Campaign
                </button>
            </form>

            {/* Campaign List */}
            <div className="space-y-2">
                {campaigns.length === 0 && <p>No campaigns found</p>}
                {campaigns.map((c) => (
                    <div key={c._id} className="flex items-center justify-between rounded border p-3">
                        <div>
                            <h2 className="font-semibold">{c.title}</h2>
                            <p className="text-sm text-gray-500">{c.type.toUpperCase()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Campaign;