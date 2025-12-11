import React, { useState } from "react";

const BrandForm = ({ initialData = {}, onSubmit, loading }) => {
    const [name, setName] = useState(initialData.name || "");
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(initialData.logo || null);

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        if (logo) formData.append("logo", logo);

        onSubmit(formData);
    };

    return (
        <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-semibold">
                {initialData?._id ? "Edit Brand" : "Add New Brand"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                    <label className="mb-1 block font-medium">Brand Name</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter brand name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Upload */}
                <div>
                    <label className="mb-1 block font-medium">Brand Logo</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogo}
                        className="w-full cursor-pointer rounded-lg border p-2"
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 h-24 w-24 rounded-lg border object-contain p-2"
                        />
                    )}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
                >
                    {loading
                        ? "Saving..."
                        : initialData?._id
                            ? "Update Brand"
                            : "Create Brand"}
                </button>
            </form>
        </div>
    );
};

export default BrandForm;
