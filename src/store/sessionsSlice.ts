import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  subscription_status: string;
  first_name: string;
  last_name: string;
}

interface SessionState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: SessionState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      action.payload
        ? localStorage.setItem("token", action.payload)
        : localStorage.removeItem("token");
      state.token = action.payload;
      state.isAuthenticated = action.payload ? true : false;
      // console.log(localStorage.getItem("token"));
    },
    setUser: (state, action: PayloadAction<User>) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.user = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, clearToken, setUser } = sessionSlice.actions;
export default sessionSlice.reducer;
