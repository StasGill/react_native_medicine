// slices/medicineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const medicineSlice = createSlice({
  name: "medicine",
  initialState: [],
  reducers: {
    addMedicine: (state, action) => {
      state.push(action.payload);
    },
    removeMedicine: (state, action) => {
      return state.filter((med) => med.id !== action.payload);
    },
    toggleTaken: (state, action) => {
      const med = state.find((med) => med.id === action.payload);
      if (med) med.taken = !med.taken;
    },
  },
});

export const { addMedicine, removeMedicine, toggleTaken } =
  medicineSlice.actions;
export default medicineSlice.reducer;
