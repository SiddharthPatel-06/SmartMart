import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "transparent border border-neutral-700 text-white rounded-md px-3 py-2 focus:outline-none outline-none" +
        className
      }
      {...props}
    />
  );
}
