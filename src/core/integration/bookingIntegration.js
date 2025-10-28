// src/core/integration/bookingIntegration.js
import { createBooking } from '../../domain/usecases/createBooking.js';
import { store } from '../../store/index.js';

export const submitBookingIntegration = async (bookingData) => {
  try {
    console.log('🎯 SOLID Integration - Criando booking');
    
    // 🎯 DOMAIN LAYER
    const booking = await createBooking(bookingData);
    
    // 🎯 REDUX LAYER
    store.dispatch({
      type: 'booking/addBooking',
      payload: booking
    });
    
    return { success: true, data: booking };
  } catch (error) {
    console.error('❌ Integration Error:', error);
    return { success: false, error: error.message };
  }
};