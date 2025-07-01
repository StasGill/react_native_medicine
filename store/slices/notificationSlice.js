// slices/medicineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {},
  reducers: {
    hourNotification: (state, action) => {
      state.hourNotification = action.payload;
    },
    minuteNotification: (state, action) => {
      state.minuteNotification = action.payload;
    },
    removeNotification: (state, action) => {
      return state.filter((med) => med.id !== action.payload);
    },
    toggleNotification: (state, action) => {
      const med = state.find((med) => med.id === action.payload);
      if (med) med.taken = !med.taken;
    },
  },
});

export const { hourNotification, minuteNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
