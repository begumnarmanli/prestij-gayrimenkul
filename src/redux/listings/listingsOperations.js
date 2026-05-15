import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const cleanDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
  };
};

export const fetchListings = createAsyncThunk(
  "listings/fetchAll",
  async (
    { page = 1, limit = 9, type, city_district, listing_type } = {},
    thunkAPI,
  ) => {
    try {
      const snap = await getDocs(collection(db, "listings"));
      let all = [];
      snap.forEach((doc) => all.push(cleanDoc(doc)));

      if (type) all = all.filter((l) => l.type === type);
      if (city_district)
        all = all.filter((l) => l.city_district === city_district);
      if (listing_type)
        all = all.filter((l) => l.listing_type === listing_type);

      const totalPages = Math.ceil(all.length / limit);
      const start = (page - 1) * limit;
      const items = all.slice(start, start + limit);

      return { items, totalPages, page };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchPropertyTypes = createAsyncThunk(
  "listings/fetchPropertyTypes",
  async (_, thunkAPI) => {
    try {
      const snap = await getDocs(collection(db, "listings"));
      const types = new Set();
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.type) types.add(data.type);
      });
      return [...types];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchDistricts = createAsyncThunk(
  "listings/fetchDistricts",
  async (_, thunkAPI) => {
    try {
      const snap = await getDocs(collection(db, "listings"));
      const districts = new Set();
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.city_district) districts.add(data.city_district);
      });
      return [...districts];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
