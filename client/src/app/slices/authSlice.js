import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserService,
  signupUserService,
  sendOtpService,
  verifyOtpService,
} from "../../services/authService";
import { updateProfileService } from "../../services/profileService";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserService(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signupUserService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await sendOtpService(emailData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await verifyOtpService(otpData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Invalid OTP");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProfileService(userId, formData);
      if (!response.user) {
        throw new Error("User data not received");
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || "Profile update failed");
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  profileStatus: "idle",
  error: null,
  otpSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    restoreAuth: (state, action) => {
      state.token = action.payload.token || null;
      state.user = action.payload.user || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.profileStatus = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.user = {
          ...state.user,
          ...action.payload,
          profile: {
            ...state.user?.profile,
            ...action.payload?.profile,
          },
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, updateUser, restoreAuth } =
  authSlice.actions;
export default authSlice.reducer;
