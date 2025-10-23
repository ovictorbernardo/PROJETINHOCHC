import { useState, useEffect } from 'react';
import { BookingService } from '../services/bookingService';

export const useBookings = (filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = BookingService.subscribeToBookings(
      (bookingsData) => {
        setBookings(bookingsData);
        setLoading(false);
        setError(null);
      },
      filters
    );

    return () => unsubscribe();
  }, [JSON.stringify(filters)]);

  const createBooking = async (bookingData) => {
    try {
      return await BookingService.createBooking(bookingData);
    } catch (err) {
      setError('Erro ao criar agendamento');
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await BookingService.updateBookingStatus(bookingId, status);
    } catch (err) {
      setError('Erro ao atualizar agendamento');
      throw err;
    }
  };

  return { bookings, loading, error, createBooking, updateBookingStatus };
};