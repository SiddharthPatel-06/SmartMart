import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCartService,
  generateInvoiceService,
  getLatestInvoiceService,
} from "../../services/billingService";

export const addToCart = createAsyncThunk(
  "billing/addToCart",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addToCartService(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const generateInvoice = createAsyncThunk(
  "billing/generateInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const res = await generateInvoiceService(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getLatestInvoice = createAsyncThunk(
  "billing/getLatestInvoice",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getLatestInvoiceService(userId);
      return res.data.invoice;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState: { status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(generateInvoice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateInvoice.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getLatestInvoice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLatestInvoice.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.latestInvoice = action.payload;
      })
      .addCase(getLatestInvoice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default billingSlice.reducer;
