import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMartByIdService,
  fetchMartByOwnerService,
} from "../../services/martService";

export const fetchMart = createAsyncThunk(
  "mart/fetch",
  async (martId, { rejectWithValue }) => {
    try {
      const response = await fetchMartByIdService(martId);
      return response.data?.mart || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMartByOwner = createAsyncThunk(
  "mart/fetchByOwner",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await fetchMartByOwnerService(ownerId);
      return response.data?.mart || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  mart: null,
  status: "idle",
  error: null,
};

const martSlice = createSlice({
  name: "mart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mart = action.payload;
      })
      .addCase(fetchMart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchMartByOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMartByOwner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mart = action.payload;
      })
      .addCase(fetchMartByOwner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default martSlice.reducer;
