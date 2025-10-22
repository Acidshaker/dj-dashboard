import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionsSlice";
import { uiSlice } from "./uiSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
