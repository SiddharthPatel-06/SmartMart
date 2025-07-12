import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getOptimizedBatch = createAsyncThunk(
  "delivery/getOptimizedBatch",
  async (martId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/order/batch/${martId}`
      );
      return {
        martCoords: data.mart?.location?.coordinates ?? [],
        route: data.optimizedRoute ?? [],
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    martCoords: [],
    markers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getOptimizedBatch.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(getOptimizedBatch.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(getOptimizedBatch.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.martCoords = payload.martCoords;

        /* ⇢ map API objects → leaflet‑friendly marker objects */
        s.markers = payload.route.map(({ order, distance }) => ({
          id: order._id,
          coords: order.customerAddress.location.coordinates,
          phone: order.phone ?? "—",
          distance,
          status: order.status,
        }));
      }),
});

export default deliverySlice.reducer;
