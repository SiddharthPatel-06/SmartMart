import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import martReducer from "./slices/martSlice";
import billingReducer from "./slices/billingSlice";
import orderReducer from "./slices/orderSlice";
import deliveryReducer from "./slices/deliverySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mart: martReducer,
    billing: billingReducer,
    order: orderReducer,
    delivery: deliveryReducer,
  },
});

export default store;
