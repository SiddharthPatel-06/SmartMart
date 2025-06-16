import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children, className = "", contentClassName = "" }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}>
      <div
        className={`bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-md mx-4 p-6 relative ${contentClassName}`}
      >
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
