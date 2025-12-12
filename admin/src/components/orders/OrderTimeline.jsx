import React, { useEffect, useState } from "react";

const OrderTimeline = ({ events = [] }) => {
    const [highlighted, setHighlighted] = useState(null);

    useEffect(() => {
        if (events.length > 0) {
            const latest = events[events.length - 1];
            setHighlighted(latest.date);

            const timer = setTimeout(() => setHighlighted(null), 3000); // 3s highlight
            return () => clearTimeout(timer);
        }
    }, [events]);

    if (!events.length) return <div>No timeline available.</div>;

    return (
        <ul className="space-y-3">
            {events.map((e, idx) => (
                <li
                    key={idx}
                    className={`p-3 border rounded transition-colors duration-500 ${highlighted === e.date ? "bg-green-100 animate-pulse" : "bg-white"
                        }`}
                >
                    <div className="text-sm text-gray-600">{new Date(e.date).toLocaleString()}</div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-gray-700">{e.note}</div>
                </li>
            ))}
        </ul>
    );
};

export default OrderTimeline;
