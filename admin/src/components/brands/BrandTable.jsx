import React from "react";

const BrandTable = ({ data, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left">
                <thead className="border-b bg-gray-100">
                    <tr>
                        <th className="p-3">Logo</th>
                        <th className="p-3">Brand Name</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td className="p-4 text-center" colSpan="3">
                                No brands found.
                            </td>
                        </tr>
                    ) : (
                        data.map((brand) => (
                            <tr key={brand._id} className="border-b">
                                <td className="p-3">
                                    <img
                                        src={brand.logo}
                                        className="h-16 w-16 rounded border object-contain p-1"
                                    />
                                </td>

                                <td className="p-3 font-medium">{brand.name}</td>

                                <td className="flex gap-3 p-3">
                                    <button
                                        onClick={() => onEdit(brand)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(brand._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BrandTable;
