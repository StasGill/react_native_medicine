// slices/medicineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const medicineSlice = createSlice({
  name: "medicine",
  initialState: {},

  reducers: {
    addMedicine: (state, action) => {
      state = { ...action.payload };
    },

    removeMedicine: (state, action) => {
      const { date, id } = action.payload;
      if (state[date]) {
        state[date] = state[date].filter((med) => med.id !== id);
        if (state[date].length === 0) delete state[date];
      }
    },

    toggleTaken: (state, action) => {
      const { date, id } = action.payload;
      const list = state[date];
      if (list) {
        const med = list.find((item) => item.id === id);
        if (med) med.taken = !med.taken;
      }
    },

    setAllMedicines: (state, action) => {
      return action.payload; // Full object from AsyncStorage
    },
  },
});

export const { addMedicine, removeMedicine, toggleTaken, setAllMedicines } =
  medicineSlice.actions;
export default medicineSlice.reducer;

// { "2025-06-23": [{ "id": "9e20f6d7-217d-4b3c-8ee9-4c1c8ed267ff", "name": "Ибупрофен", "quantity": "2 таблетки", "duration": "2", "times": ["Утро"], "taken": false }, { "id": "7dd64703-243f-47bc-b4f0-da63735211b1", "name": "Ибупрофен", "quantity": "2 таблетки", "duration": "2", "times": ["День"], "taken": false }] }
