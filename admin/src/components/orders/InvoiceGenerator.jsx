// src/components/invoice/InvoiceGenerator.jsx
import React, { useState } from "react";
import { currency } from "../../config";

const InvoiceGenerator = () => {
    const [invoiceData, setInvoiceData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        items: [{ name: "", quantity: 1, price: 0 }],
        invoiceDate: new Date().toISOString().slice(0, 10),
    });

    // Handle input change for customer and invoice details
    const handleChange = (e) => {
        setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
    };

    // Handle item change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index][field] = field === "quantity" || field === "price" ? Number(value) : value;
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    // Add new item
    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...invoiceData.items, { name: "", quantity: 1, price: 0 }],
        });
    };

    // Remove item
    const removeItem = (index) => {
        const updatedItems = invoiceData.items.filter((_, idx) => idx !== index);
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    // Calculate total
    const totalAmount = invoiceData.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h2 className="mb-6 text-2xl font-bold">Invoice Generator</h2>

            {/* Customer Info */}
            <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 font-semibold">Customer Info</h3>
                <input
                    type="text"
                    name="customerName"
                    placeholder="Name"
                    value={invoiceData.customerName}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="email"
                    name="customerEmail"
                    placeholder="Email"
                    value={invoiceData.customerEmail}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="text"
                    name="customerPhone"
                    placeholder="Phone"
                    value={invoiceData.customerPhone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Invoice Items */}
            <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 font-semibold">Items</h3>
                {invoiceData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            className="flex-1 p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            className="w-20 p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                            className="p-2 border rounded w-28"
                        />
                        <button
                            onClick={() => removeItem(index)}
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={addItem}
                    className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    Add Item
                </button>
            </div>

            {/* Invoice Summary */}
            <div className="p-4 bg-white rounded shadow">
                <h3 className="mb-2 font-semibold">Invoice Summary</h3>
                <p>Date: {invoiceData.invoiceDate}</p>
                <table className="w-full mt-2 border border-collapse border-gray-300 table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border border-gray-300">Item</th>
                            <th className="p-2 border border-gray-300">Qty</th>
                            <th className="p-2 border border-gray-300">Price</th>
                            <th className="p-2 border border-gray-300">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="p-2 border border-gray-300">{item.name}</td>
                                <td className="p-2 border border-gray-300">{item.quantity}</td>
                                <td className="p-2 border border-gray-300">{currency}{item.price.toFixed(2)}</td>
                                <td className="p-2 border border-gray-300">{currency}{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="mt-4 text-lg font-bold text-right">
                    Total: {currency}{totalAmount.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
