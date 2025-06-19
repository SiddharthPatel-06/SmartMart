import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex items-center justify-between border-b border-[#292929] px-6 md:px-10 py-3 relative">
        <div className="flex items-center gap-4">
          <div className="size-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_535)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_535">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-lg font-bold">SmartMart</h2>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Dashboard", "Orders", "Customers", "Inventory", "Suppliers"].map(
            (item) => (
              <Link key={item} className="text-sm font-medium" to="/login">
                {item}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:inline-block ml-4">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {menuOpen && (
          <div className="absolute top-[62px] left-4 right-4 bg-neutral-800 rounded-xl border border-neutral-700 shadow-lg z-50 animate-slideDown">
            <div className="flex flex-col items-start p-4 space-y-3">
              {[
                "Dashboard",
                "Orders",
                "Customers",
                "Inventory",
                "Suppliers",
              ].map((item) => (
                <Link
                  key={item}
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full px-3 py-2 rounded hover:bg-neutral-700 transition"
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 ml-2.5"
              >
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-col items-center justify-center text-center p-6 min-h-[calc(100vh-72px)]">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to SmartMart
        </h1>
        <p className="text-base md:text-lg mb-6">
          Intelligent Mart Management System
        </p>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
