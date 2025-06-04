import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      className={`bg-white text-black px-4 py-2 rounded-md font-medium 
      hover:bg-neutral-200 hover:text-black 
      transition duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
