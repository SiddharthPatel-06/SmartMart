import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/auth";

export const loginUserService = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const signupUserService = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      header: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed. Please Check your Information."
    );
  }
};

export const sendOtpService = async (emailData) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, emailData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

export const verifyOtpService = async (otpData) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, otpData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("OTP Verification Error:", error.response?.data);
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};
