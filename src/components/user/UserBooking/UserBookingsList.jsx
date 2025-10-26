// src/components/user/UserBookings/UserBookingsList.jsx
import React from 'react';
import BookingCard from './BookingCard';
// 🆕 ADICIONADO: Import do EmptyState
import EmptyState from '../../ui/EmptyState';

const UserBookingsList = ({ bookings, mesAno }) => {
  const filteredBookings = bookings.filter(booking => 
    booking.mesAno === mesAno
  );

  if (filteredBookings.length === 0) {
    return (
      <EmptyState 
        icon="📭"
        title="Nenhum agendamento encontrado"
        message={`Você não possui agendamentos para ${mesAno}.`}
        action={
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Fazer Primeiro Agendamento
          </button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          📊 Você possui <strong>{filteredBookings.length}</strong> agendamento(s) para este mês.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
          />
        ))}
      </div>
    </div>
  );
};

export default UserBookingsList;