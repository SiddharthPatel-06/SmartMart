import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getSalesStatsService,
  getTopProductsService,
  getLeastProductsService,
  getExpiringProductsService,
} from "../../services/analyticsService";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { range, topLimit, leastLimit, days } = params;

      const [sales, top, least, expiring] = await Promise.all([
        getSalesStatsService(range),
        getTopProductsService(topLimit),
        getLeastProductsService(leastLimit),
        getExpiringProductsService(days),
      ]);

      return { sales, top, least, expiring, params };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
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
    params: {
      range: "daily",
      topLimit: 5,
      leastLimit: 5,
      days: 30,
    },
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
        state.params = action.payload.params || state.params;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
