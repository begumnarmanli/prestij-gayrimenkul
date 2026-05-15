import { createSlice } from "@reduxjs/toolkit";
import {
  fetchListings,
  fetchPropertyTypes,
  fetchDistricts,
} from "./listingsOperations";

const initialState = {
  items: [],
  page: 1,
  totalPages: 1,
  filters: {
    type: "",
    city_district: "",
    listing_type: "",
  },
  propertyTypes: [],
  districts: [],
  isLoading: false,
  error: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
        state.propertyTypes = action.payload;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
      });
  },
});

export const { setPage, setFilters, resetFilters } = listingsSlice.actions;
export default listingsSlice.reducer;
