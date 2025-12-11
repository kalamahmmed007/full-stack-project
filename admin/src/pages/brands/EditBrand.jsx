import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { getBrandById, updateBrand } from "../../redux/slices/brandSlice";

const EditBrand = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { brandId } = useParams();

    // Use selector to get brand directly from store
    const brand = useSelector((state) => getBrandById(state, brandId));
    const { loading } = useSelector((state) => state.brand);

    const [brandName, setBrandName] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Validation schema
    const brandSchema = Yup.object().shape({
        brandName: Yup.string().required("Brand name is required"),
        description: Yup.string(),
    });

    // Prefill form when brand is loaded
    useEffect(() => {
        if (brand) {
            setBrandName(brand.name || "");
            setDescription(brand.description || "");
            setLogoPreview(brand.logo || null);
        }
    }, [brand]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await brandSchema.validate(
                { brandName, description },
                { abortEarly: false }
            );

            const formData = new FormData();
            formData.append("name", brandName);
            formData.append("description", description);
            if (logo) formData.append("logo", logo);

            const res = await dispatch(
                updateBrand({ id: brandId, data: formData })
            );

            if (res?.payload?.success) {
                toast.success("Brand updated successfully 🎉");
                navigate("/admin/brands");
            } else {
                toast.error(res?.payload?.message || "Update failed");
            }
        } catch (err) {
            if (err.inner) {
                err.inner.forEach((error) => toast.error(error.message));
            } else {
                toast.error("Validation failed");
            }
        }
    };

    if (!brand) return <p className="py-10 text-center">Loading brand...</p>;

    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-6 text-3xl font-semibold">Edit Brand</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
            >
                {/* Brand Name */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Brand Name</label>
                    <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-28 w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
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
                            <p className="mb-1 text-xs text-gray-500">Preview:</p>
                            <img
                                src={logoPreview}
                                alt="Preview"
                                className="h-24 w-24 rounded-lg border object-cover"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Brand"}
                </button>
            </form>
        </div>
    );
};

export default EditBrand;
