import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "./listings/listingsSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    auth: authReducer,
  },
});
