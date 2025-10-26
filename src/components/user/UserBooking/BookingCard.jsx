// src/components/user/UserBookings/BookingCard.jsx
import React from 'react';

const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmado: 'bg-green-100 text-green-800 border-green-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      pendente: 'Pendente',
      confirmado: 'Confirmado', 
      cancelado: 'Cancelado'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">
            {booking.dia}/{booking.mesAno}
          </h3>
          <p className="text-sm text-gray-600">{booking.nome}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="w-20 font-medium">Email:</span>
          <span>{booking.email}</span>
        </div>
        <div className="flex items-center">
          <span className="w-20 font-medium">Telefone:</span>
          <span>{booking.telefone}</span>
        </div>
        <div className="flex items-center">
          <span className="w-20 font-medium">Visitantes:</span>
          <span>{booking.numeroVisitantes} pessoa(s)</span>
        </div>
        <div className="flex items-center">
          <span className="w-20 font-medium">Criado em:</span>
          <span>{formatDate(booking.createdAt)}</span>
        </div>
      </div>

      {booking.status === 'pendente' && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
            Cancelar Agendamento
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;