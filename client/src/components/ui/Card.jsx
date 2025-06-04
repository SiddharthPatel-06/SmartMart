import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden " +
        className
      }
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={"p-4 " + className}>{children}</div>;
}
