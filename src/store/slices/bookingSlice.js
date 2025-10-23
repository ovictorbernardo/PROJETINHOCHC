import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: [],
    loading: false
  },
  reducers: {
    addBooking: (state, action) => {
      state.items.push(action.payload);
    },
    updateBookingStatus: (state, action) => {
      const { bookingId, status } = action.payload;
      const booking = state.items.find(item => item.id === bookingId);
      if (booking) {
        booking.status = status;
      }
    },
    setBookingsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookings: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { 
  addBooking, 
  updateBookingStatus,
  setBookingsLoading,
  setBookings
} = bookingSlice.actions;

// ✅ SELECTORS EXPORTADOS CORRETAMENTE
export const selectAllBookings = (state) => state.bookings.items;
export const selectBookingsLoading = (state) => state.bookings.loading;

export default bookingSlice.reducer;