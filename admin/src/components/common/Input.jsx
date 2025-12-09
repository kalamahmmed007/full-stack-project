import React from "react";

const Input = ({ type = "text", placeholder, className, ...rest }) => (
    <input
        type={type}
        placeholder={placeholder}
        className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 ${className}`}
        {...rest}
    />
);

export default Input;
