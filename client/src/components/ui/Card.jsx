import React from "react";

export function Card({ children, className = "", bgClass = "" }) {
  return (
    <div
      className={
        `border border-white/10 rounded-lg shadow-md overflow-hidden ${bgClass} ` +
        className
      }
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={"p-6 " + className}>{children}</div>;
}
