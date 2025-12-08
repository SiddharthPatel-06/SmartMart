import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getOptimizedBatch = createAsyncThunk(
  "delivery/getOptimizedBatch",
  async (martId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `https://smartmart-qno0.onrender.com/api/v1/order/batch/${martId}`
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

export const updateOrderStatus = createAsyncThunk(
  "delivery/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        "https://smartmart-qno0.onrender.com/api/v1/order/status",
        { orderId, status }
      );
      return { orderId, status: data.status };
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
    martCoords: [], // [lng, lat]
    markers: [], // [{ id, coords, phone, distance, status }]
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) =>
    b
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

        /* convert API → leaflet‑friendly markers */
        s.markers = payload.route.map(({ order, distance }, idx) => ({
          id: order._id,
          seq: idx + 1, // ➊ sequence no.
          coords: order.customerAddress.location.coordinates,
          phone: order.phone ?? "—",
          distance,
          status: order.status,
        }));
      })

      .addCase(updateOrderStatus.fulfilled, (s, { payload }) => {
        const m = s.markers.find((x) => x.id === payload.orderId);
        if (m) m.status = payload.status;
      }),
});

export default deliverySlice.reducer;
