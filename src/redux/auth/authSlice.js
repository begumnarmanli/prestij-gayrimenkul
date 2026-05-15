import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    updateUser: (state, action) => {
      state.user = {
        ...(state.user || {}),
        ...action.payload,
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    toggleFavorite: (state, action) => {
      const id = action.payload;
      const favorites = state.user?.favorites || [];
      const exists = favorites.includes(id);
      state.user.favorites = exists
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout, updateUser, toggleFavorite } =
  authSlice.actions;
export default authSlice.reducer;
