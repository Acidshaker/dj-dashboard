import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const savedMode = localStorage.getItem("darkMode") === "true";

interface UIState {
  loading: boolean;
  darkMode: boolean;
  navBarOpen: boolean;
  params: Record<string, any>;
}

const initialState: UIState = {
  loading: false,
  darkMode: savedMode,
  navBarOpen: false,
  params: {
    page: 1,
    limit: 10,
    search: "",
    offset: 0,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
toggleDarkMode: (state) => {
  state.darkMode = !state.darkMode;
  localStorage.setItem("darkMode", String(state.darkMode));
},
    toggleNavBar: (state) => {
      state.navBarOpen = !state.navBarOpen;
    },
    setParams: (state, action: PayloadAction<Record<string, any>>) => {
      state.params = action.payload;
    },
    clearParams: (state) => {
      state.params = {};
    },
  },
});

export const {
  showLoading,
  hideLoading,
  toggleDarkMode,
  toggleNavBar,
  setParams,
  clearParams,
} = uiSlice.actions;

export default uiSlice.reducer;
