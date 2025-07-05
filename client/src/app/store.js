import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import martReducer from "./slices/martSlice";
import billingReducer from "./slices/billingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mart: martReducer,
    billing: billingReducer,
  },
});

export default store;
