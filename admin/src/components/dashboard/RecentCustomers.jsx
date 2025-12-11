// src/components/dashboard/RecentCustomers.jsx

import React from "react";

const RecentCustomers = () => {
    // Dummy data for now
    const customers = [
        { id: 1, name: "Alice Smith", email: "alice@example.com" },
        { id: 2, name: "Bob Johnson", email: "bob@example.com" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
    ];

    return (
        <div className="rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">Recent Customers</h2>
            <ul className="space-y-2">
                {customers.map((customer) => (
                    <li key={customer.id} className="text-gray-700">
                        <span className="font-medium">{customer.name}</span> - {customer.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentCustomers;
