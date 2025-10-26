// src/hooks/useBookings.js
import { useState, useEffect } from 'react';
import { BookingService } from '../services/bookingService';

export const useBookings = (filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let bookingsData = [];
        
        if (filters.mesAno) {
          // Carregar por mês específico
          bookingsData = await BookingService.loadBookingsByMes(filters.mesAno);
        } else {
          // Carregar todos
          bookingsData = await BookingService.loadAllBookings();
        }
        
        setBookings(bookingsData);
      } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
        setError('Erro ao carregar agendamentos');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();

    // Escuta mudanças em tempo real se houver filtro de mês
    if (filters.mesAno) {
      const unsubscribe = BookingService.subscribeToBookings(filters.mesAno, (bookingsData) => {
        setBookings(bookingsData);
      });

      return () => unsubscribe();
    }
  }, [JSON.stringify(filters)]);

  const createBooking = async (bookingData) => {
    try {
      setError(null);
      const newBooking = await BookingService.createBooking(bookingData);
      
      // Atualiza estado local
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      setError('Erro ao criar agendamento');
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setError(null);
      await BookingService.updateBookingStatus(bookingId, status);
      
      // Atualiza estado local
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status, updatedAt: new Date().toISOString() }
            : booking
        )
      );
      return true;
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      setError('Erro ao atualizar agendamento');
      throw err;
    }
  };

  return { 
    bookings, 
    loading, 
    error, 
    createBooking, 
    updateBookingStatus,
    refetch: () => {
      setLoading(true);
      // Recarregar será feito pelo useEffect
    }
  };
};