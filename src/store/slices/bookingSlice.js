// src/store/slices/bookingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setBookingsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookingsError: (state, action) => {
      state.error = action.payload;
    },
    addBooking: (state, action) => {
      state.items.push(action.payload);
    },
    updateBooking: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    removeBooking: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setBookings: (state, action) => {
      state.items = action.payload;
    },
    clearBookingsError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setBookingsLoading,
  setBookingsError,
  addBooking,
  updateBooking,
  removeBooking,
  setBookings,
  clearBookingsError
} = bookingSlice.actions;

// ✅ SELECTORS SIMPLES - SEM MEMOIZAÇÃO COMPLEXA
export const selectAllBookings = (state) => state.booking?.items || [];
export const selectBookingsLoading = (state) => state.booking?.loading || false;
export const selectBookingsError = (state) => state.booking?.error || null;

export default bookingSlice.reducer;