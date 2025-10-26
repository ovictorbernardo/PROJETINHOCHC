// src/components/admin/Management/BookingsManager/BookingRow.jsx
import React, { useState } from 'react';

const BookingRow = ({ booking, mesAno, onUpdateBooking, onCancelBooking }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(booking.status);

  const statusOptions = [
    { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmado', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  const handleSave = () => {
    onUpdateBooking(booking.id, { status });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setStatus(booking.status);
    setIsEditing(false);
  };

  const currentStatus = statusOptions.find(opt => opt.value === booking.status);

  // 🆕 Dados do novo formulário
  const primeiroAdulto = booking.adultos?.[0] || {};
  const totalPessoas = booking.totalPessoas || 0;
  const dataInfo = booking.data || {};

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-medium">{dataInfo.dia}/{mesAno}</div>
        <div className="text-sm text-gray-500">{dataInfo.horario}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{primeiroAdulto.nome}</div>
        <div className="text-sm text-gray-500">
          {booking.adultos?.length || 0} adulto(s), {booking.criancas?.length || 0} criança(s)
        </div>
      </td>
      <td className="px-4 py-3">
        <div>{primeiroAdulto.email}</div>
        <div className="text-sm text-gray-500">{primeiroAdulto.telefone}</div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {totalPessoas} {totalPessoas === 1 ? 'pessoa' : 'pessoas'}
        </span>
      </td>
      <td className="px-4 py-3">
        {!isEditing ? (
          <span className={`px-2 py-1 rounded text-xs ${currentStatus?.color}`}>
            {currentStatus?.label}
          </span>
        ) : (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-1 border rounded text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-3">
        {!isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => onCancelBooking(booking.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Salvar
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancelar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default BookingRow;