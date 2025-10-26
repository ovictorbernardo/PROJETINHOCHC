// src/components/admin/Management/BookingsManager/BookingsManager.jsx
import React from 'react';
import BookingRow from './BookingRow';
import EmptyState from '../../../ui/EmptyState';

const BookingsManager = ({ bookings, mesAno }) => {
  const filteredBookings = bookings.filter(booking => 
    booking.data?.mesAno === mesAno
  );

  const handleUpdateBooking = (bookingId, updates) => {
    console.log('Booking atualizado:', bookingId, updates);
    // TODO: Integrar com Redux/Firebase
  };

  const handleCancelBooking = (bookingId) => {
    console.log('Booking cancelado:', bookingId);
    // TODO: Integrar com Redux/Firebase
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Gerenciar Agendamentos</h3>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          📊 Total de agendamentos este mês: <strong>{filteredBookings.length}</strong>
        </p>
        {filteredBookings.length > 0 && (
          <p className="text-xs text-blue-600 mt-1">
            👥 Total de pessoas: <strong>
              {filteredBookings.reduce((total, booking) => total + (booking.totalPessoas || 0), 0)}
            </strong>
          </p>
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState 
          icon="📊"
          title="Nenhum agendamento encontrado"
          message={`Não há agendamentos para ${mesAno} no momento.`}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data/Horário</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Visitantes</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contato</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pessoas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  mesAno={mesAno}
                  onUpdateBooking={handleUpdateBooking}
                  onCancelBooking={handleCancelBooking}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;