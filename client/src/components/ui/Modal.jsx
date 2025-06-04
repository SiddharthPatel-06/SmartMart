import React from "react";
import { FiX } from "react-icons/fi";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 max-h-screen overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-neutral-900 rounded-lg w-full ${maxWidth} border border-neutral-800 `}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
            <h2 className="text-xl font-bold">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
