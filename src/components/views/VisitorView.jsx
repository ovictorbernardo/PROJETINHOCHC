// src/components/views/VisitorView.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from '../common/Calendar/Calendar';
// 🆕 TROCADO: BookingForm → AdvancedBookingForm
import AdvancedBookingForm from '../user/Booking/AdvancedBookingForm';
import { setSelectedDay } from '../../store/slices/uiSlice';

const VisitorView = ({ 
  currentMesAno, 
  agenda, 
  selectedDay, 
  bookingFormLoading,
  onBookingSubmit,
  onDaySelect 
}) => {
  const dispatch = useDispatch();

  const handleDaySelect = (day) => {
    if (day.status === 'disponivel') {
      dispatch(setSelectedDay(day));
      if (onDaySelect) onDaySelect(day);
    } else {
      if (day.status === 'indisponivel') {
        alert('🔒 Este mês não está disponível para agendamentos no momento.');
      } else if (day.status === 'fechado') {
        alert('🚫 Este dia está fechado.');
      } else if (day.status === 'lotado') {
        alert('📦 Este dia está lotado.');
      }
    }
  };

  const handleBookingSubmit = (bookingData) => {
    if (onBookingSubmit) {
      onBookingSubmit(bookingData);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Calendar
          mesAno={currentMesAno}
          dias={agenda.dias || []}
          onDaySelect={handleDaySelect}
          selectedDay={selectedDay?.dia}
        />
      </div>

      {selectedDay && (
        <AdvancedBookingForm
          selectedDay={selectedDay}
          mesAno={currentMesAno}
          onSubmit={handleBookingSubmit}
          onCancel={() => dispatch(setSelectedDay(null))}
          loading={bookingFormLoading}
        />
      )}
    </>
  );
};

export default VisitorView;