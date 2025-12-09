import React from "react";

const StatCard = ({ title, value }) => (
    <div className="p-4 text-white bg-red-600 rounded shadow-md">
        <p className="font-semibold">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
    </div>
);

export default StatCard;
