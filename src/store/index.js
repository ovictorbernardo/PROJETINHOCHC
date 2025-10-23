import { configureStore } from '@reduxjs/toolkit';
import agendaReducer from './slices/agendaSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    agenda: agendaReducer,
    bookings: bookingReducer,
    ui: uiReducer,
  }
});