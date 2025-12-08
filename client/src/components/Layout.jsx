import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
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
  FiEdit,
  FiSave,
  FiMapPin,
} from "react-icons/fi";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";

const menuItems = [
  { name: "dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
  { name: "inventory", icon: <FiPackage size={20} />, path: "/inventory" },
  { name: "billing", icon: <FiDollarSign size={20} />, path: "/billing" },
  {
    name: "Create Order",
    icon: <FiTruck size={20} />,
    path: "/create-order",
  },
  {
    name: "delivery map",
    icon: <FiMapPin size={20} />,
    path: "/delivery-map",
  },
  {
    name: "customer suppliers",
    icon: <FiUsers size={20} />,
    path: "/suppliers",
  },
  { name: "reports", icon: <FiPieChart size={20} />, path: "/reports" },
  { name: "user management", icon: <FiUser size={20} />, path: "/users" },
];

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const profile = user?.profile || {};

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    contactNumber: profile.contactNumber || "",
    gender: profile.gender || "other",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );

    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const userId = user?.id || localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in state or localStorage");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("gender", formData.gender);
      if (selectedFile) {
        formDataToSend.append("profileImage", selectedFile);
      }

      await dispatch(
        updateProfile({ userId: userId, formData: formDataToSend })
      ).unwrap();

      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Update failed:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        contactNumber: profile.contactNumber || "",
        gender: profile.gender || "other",
      });
      setSelectedFile(null);
    }
    setIsEditing(!isEditing);
  };
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out Successfully!");
    navigate("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <div className="h-full fixed w-64 bg-neutral-950 p-4 flex flex-col border-r border-neutral-800">
        <div className="flex items-center gap-2 text-2xl font-bold mb-8 p-[13px] border-b border-neutral-800">
          {/* Logo */}
          <div className="size-6 text-white">
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

          <div>SmartMart</div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
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
      <div className="flex-1 flex flex-col h-full ml-64">
        {/* Header */}
        <header className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between fixed w-[calc(100%-16rem)] z-10">
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

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:bg-neutral-800 p-1 rounded-full transition"
            >
              <img
                src={profile.profileImage || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto will-change-transform">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setIsEditing(false);
          setSelectedFile(null);
        }}
        title="Profile Details"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center">
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : profile.profileImage || "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          {isEditing && (
            <label className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 mb-4">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
          <h3 className="text-lg font-semibold">
            {isEditing ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-neutral-800  p-1 rounded w-24 text-white focus:outline-none focus:ring-1 focus:ring-neutral-600"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-neutral-800 p-1 rounded w-24 text-white focus:outline-none focus:ring-1 focus:ring-neutral-600"
                />
              </div>
            ) : (
              `${profile.firstName || "N/A"} ${profile.lastName || "N/A"}`
            )}
          </h3>
          <p className="text-neutral-400">{user?.email}</p>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-neutral-400 block mb-1">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            ) : (
              <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                {profile.firstName || "N/A"}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-neutral-400 block mb-1">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            ) : (
              <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                {profile.lastName || "N/A"}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-neutral-400 block mb-1">
              Contact Number
            </label>
            {isEditing ? (
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            ) : (
              <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg">
                {profile.contactNumber || "N/A"}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-neutral-400 block mb-1">
              Gender
            </label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-neutral-600 capitalize"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg capitalize">
                {profile.gender || "N/A"}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FiEdit className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt- py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Layout;
