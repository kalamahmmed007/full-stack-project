import React from "react";

const Select = ({ options, className, ...rest }) => (
    <select
        className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 ${className}`}
        {...rest}
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

export default Select;
