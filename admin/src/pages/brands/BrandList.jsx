import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BrandForm from "../../components/brands/BrandForm";
import BrandTable from "../../components/brands/BrandTable";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../../redux/slices/brandSlice";

const BrandList = () => {
    const dispatch = useDispatch();
    const { brands, loading } = useSelector((state) => state.brand);

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);

    const handleAddNew = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editData) {
            dispatch(updateBrand({ id: editData._id, data: formData }));
        } else {
            dispatch(createBrand(formData));
        }
        setModalOpen(false);
    };

    return (
        <div className="p-6">
            {/* Page header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Brands</h1>
                <Link to="/addbrand" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                    Add Brand
                </Link>
            </div>

            {/* Table */}
            <BrandTable
                data={brands}
                onEdit={(brand) => {
                    setEditData(brand);
                    setModalOpen(true);
                }}
                onDelete={(id) => dispatch(deleteBrand(id))}
            />

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
                        <BrandForm
                            initialData={editData}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />

                        <button
                            onClick={() => setModalOpen(false)}
                            className="mt-4 w-full rounded-lg bg-gray-200 py-2 hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandList;
