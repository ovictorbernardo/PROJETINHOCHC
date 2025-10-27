import BookingService from '../../services/bookingService';
import { addBooking, setBookingsLoading, setBookingsError } from '../../store/slices/bookingSlice';

export const handleBookingSubmit = ({ dispatch, setError, setSelectedDay }) => {
  return async (bookingData) => {
    dispatch(setBookingsLoading(true));
    try {
      if (setError) setError(null);

      const advancedBooking = {
        ...bookingData,
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await BookingService.createBooking(advancedBooking);
      const bookingWithId = { ...advancedBooking, id: result.id };
      dispatch(addBooking(bookingWithId));
      if (setSelectedDay) setSelectedDay(null);

      console.log('✅ Agendamento criado com ID:', result.id);
      alert('✅ Agendamento realizado com sucesso! Aguarde confirmação por email.');
      return { success: true, id: result.id };
    } catch (err) {
      console.error('❌ Erro no agendamento:', err);
      if (setError) setError('Erro ao realizar agendamento');
      dispatch(setBookingsError(err.message || 'Erro ao realizar agendamento'));
      alert('❌ Erro ao realizar agendamento. Tente novamente.');
      return { success: false, error: err };
    } finally {
      dispatch(setBookingsLoading(false));
    }
  };
};
export default handleBookingSubmit;
