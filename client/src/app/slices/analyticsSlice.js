import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getSalesStatsService,
  getTopProductsService,
  getLeastProductsService,
  getExpiringProductsService,
} from "../../services/analyticsService";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAll",
  async () => {
    const [sales, top, least, expiring] = await Promise.all([
      getSalesStatsService(),
      getTopProductsService(),
      getLeastProductsService(),
      getExpiringProductsService(),
    ]);
    return { sales, top, least, expiring };
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    loading: false,
    error: null,
    sales: [],
    top: [],
    least: [],
    expiring: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.sales;
        state.top = action.payload.top;
        state.least = action.payload.least;
        state.expiring = action.payload.expiring;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
