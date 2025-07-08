// slices/medicineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { date: new Date().toISOString().split("T")[0] },
  reducers: {
    hourNotification: (state, action) => {
      state.hourNotification = action.payload;
    },
    minuteNotification: (state, action) => {
      state.minuteNotification = action.payload;
    },
    dateNotification: (state, action) => {
      state.date = action.payload;
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

export const {
  hourNotification,
  minuteNotification,
  dateNotification,
  removeNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;

// { "2025-06-23": [{ "id": "9e20f6d7-217d-4b3c-8ee9-4c1c8ed267ff", "name": "Ибупрофен", "quantity": "2 таблетки", "duration": "2", "times": ["Утро"], "taken": false }, { "id": "7dd64703-243f-47bc-b4f0-da63735211b1", "name": "Ибупрофен", "quantity": "2 таблетки", "duration": "2", "times": ["День"], "taken": false }] }
