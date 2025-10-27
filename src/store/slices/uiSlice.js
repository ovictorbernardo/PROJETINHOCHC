// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentView: 'visitante',
    selectedDay: null,
    bookingFormLoading: false
  },
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setSelectedDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    setBookingFormLoading: (state, action) => {
      state.bookingFormLoading = action.payload;
    }
  }
});

export const {
  setCurrentView,
  setSelectedDay,
  setBookingFormLoading
} = uiSlice.actions;

// ✅ SELECTORS SIMPLES
export const selectCurrentView = (state) => state.ui.currentView;
export const selectSelectedDay = (state) => state.ui.selectedDay;
export const selectBookingFormLoading = (state) => state.ui.bookingFormLoading || false;

export default uiSlice.reducer;