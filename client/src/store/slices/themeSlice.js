import { createSlice } from "@reduxjs/toolkit";

let Theme = localStorage.getItem("theme-fixed");

const initialState = {
  theme: Theme || "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme == "dark" ? "light" : "dark";
      localStorage.setItem("theme-fixed", state.theme);

    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
