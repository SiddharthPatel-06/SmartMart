import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrderAsync = createAsyncThunk(
  "order/create",
  async (orderData, thunkAPI) => {
    const res = await axios.post(
      "http://localhost:4000/api/v1/order",
      orderData
    );
    return res.data;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: { loading: false, error: null, order: null },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
