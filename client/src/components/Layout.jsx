// src/components/Layout.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiHome,
  FiPackage,
  FiDollarSign,
  FiTruck,
  FiUsers,
  FiPieChart,
  FiUser,
} from "react-icons/fi";

const menuItems = [
  { name: "dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
  { name: "inventory", icon: <FiPackage size={20} />, path: "/inventory" },
  { name: "billing", icon: <FiDollarSign size={20} />, path: "/billing" },
  { name: "ordering & delivery", icon: <FiTruck size={20} />, path: "/delivery" },
  { name: "customer suppliers", icon: <FiUsers size={20} />, path: "/suppliers" },
  { name: "reports", icon: <FiPieChart size={20} />, path: "/reports" },
  { name: "user management", icon: <FiUser size={20} />, path: "/users" },
];

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const user = useSelector((state) => state.auth.user);
  const profile = user?.profile || {};

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-950 p-4 flex flex-col border-r border-neutral-800">
        <div className="text-2xl font-bold mb-8 p-4 border-b border-neutral-800">SmartMart</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActiveTab(item.name);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                    activeTab === item.name
                      ? "bg-neutral-800 text-white"
                      : "hover:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {item.icon}
                  <span className="capitalize">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-800 relative">
              <FiBell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <img
              src={profile.profileImage || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Main content slot */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
