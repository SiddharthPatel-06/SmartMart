import axios from "axios";

const API_URL = "https://smartmart-qno0.onrender.com/api/v1";

export const updateProfileService = async (userId, formData) => {
  if (!userId) {
    throw new Error("No user ID provided for profile update");
  }
  try {
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }

    const response = await axios.put(`${API_URL}/profile/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Profile update error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Profile update failed");
  }
};
