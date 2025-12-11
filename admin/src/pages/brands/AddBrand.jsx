// src/pages/brands/AddBrand.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand } from "../../redux/slices/brandSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const AddBrand = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux loading state
    const { loading } = useSelector((state) => state.brand);

    // Local state
    const [brandName, setBrandName] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Validation schema
    const brandSchema = Yup.object().shape({
        brandName: Yup.string().required("Brand name is required"),
        description: Yup.string(),
        logo: Yup.mixed().required("Brand logo is required"),
    });

    // Handle logo upload preview
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await brandSchema.validate(
                { brandName, description, logo },
                { abortEarly: false }
            );

            const formData = new FormData();
            formData.append("name", brandName);
            formData.append("description", description);
            formData.append("logo", logo);

            const res = await dispatch(createBrand(formData));

            if (res?.payload?.success) {
                toast.success("Brand created successfully 🎉");
                navigate("/admin/brands");
            } else {
                toast.error(res?.payload?.message || "Failed to create brand");
            }
        } catch (err) {
            if (err.inner) {
                err.inner.forEach((error) => toast.error(error.message));
            } else {
                toast.error("Validation failed");
            }
        }
    };

    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-6 text-3xl font-semibold">Add New Brand</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
            >
                {/* Brand Name */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Brand Name</label>
                    <input
                        type="text"
                        placeholder="Enter brand name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Description</label>
                    <textarea
                        placeholder="Brand description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-24 w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    ></textarea>
                </div>

                {/* Logo Upload */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Brand Logo</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full rounded-lg border p-2"
                    />

                    {logoPreview && (
                        <div className="mt-3">
                            <img
                                src={logoPreview}
                                alt="Preview"
                                className="h-24 w-24 rounded-lg border object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Brand"}
                </button>
            </form>
        </div>
    );
};

export default AddBrand;
