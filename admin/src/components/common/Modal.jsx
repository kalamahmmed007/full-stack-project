import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white rounded shadow-md w-96">
        <button
          onClick={onClose}
          className="absolute font-bold text-red-600 top-2 right-2"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
