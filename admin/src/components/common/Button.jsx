import React from "react";

const Button = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
