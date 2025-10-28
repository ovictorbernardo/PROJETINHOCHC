// src/core/handlers/bookingHandler.js - ATUALIZADO
import { submitBookingIntegration } from '../integration/bookingIntegration.js';

const handleBookingSubmit = ({ dispatch, setError, setSelectedDay }) => {
  return async (bookingData) => {
    try {
      setError(null);
      
      // 🎯 USAR INTEGRAÇÃO SOLID
      const result = await submitBookingIntegration(bookingData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Fechar formulário
      if (setSelectedDay) setSelectedDay(null);
      
      console.log('✅ Booking criado via SOLID');
      return result.data;
      
    } catch (error) {
      console.error('❌ Handler Error:', error);
      setError(error.message);
      throw error;
    }
  };
};

export default handleBookingSubmit;