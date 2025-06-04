import React from "react";

export function Select({ children, value, onValueChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={
        "bg-transparent border border-white/10 text-white rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-white/20 " +
        className
      }
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return (
    <option
      value={value}
      className="bg-[#1a1a1a] text-white"
    >
      {children}
    </option>
  );
}
