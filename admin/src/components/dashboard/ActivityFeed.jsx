// src/components/dashboard/ActivityFeed.jsx

import React from "react";

const ActivityFeed = () => {
    // Dummy data for now
    const activities = [
        { id: 1, text: "New order placed by John Doe" },
        { id: 2, text: "Product 'Laptop' stock updated" },
        { id: 3, text: "Admin Jane logged in" },
    ];

    return (
        <div className="rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">Activity Feed</h2>
            <ul className="space-y-2">
                {activities.map((act) => (
                    <li key={act.id} className="text-gray-700">
                        {act.text}
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default ActivityFeed;
