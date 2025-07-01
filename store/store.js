// store.js
import { configureStore } from "@reduxjs/toolkit";
import medicineReducer from "./slices/medicineSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    medicine: medicineReducer,
    notification: notificationReducer,
  },
});
