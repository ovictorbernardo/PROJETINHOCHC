// src/components/admin/Management/CalendarSettings/DaySettingsCard.jsx
import React, { useState } from 'react';

const DaySettingsCard = ({ day, onUpdateDay }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(day.status);
  const [observacao, setObservacao] = useState(day.observacao || '');

  const statusOptions = [
    { value: 'disponivel', label: 'Disponível', color: 'bg-green-100 border-green-500' },
    { value: 'lotado', label: 'Lotado', color: 'bg-red-100 border-red-500' },
    { value: 'fechado', label: 'Fechado', color: 'bg-gray-100 border-gray-500' },
    { value: 'indisponivel', label: 'Indisponível', color: 'bg-yellow-100 border-yellow-500' }
  ];

  const handleSave = () => {
    onUpdateDay(day.dia, { status, observacao });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStatus(day.status);
    setObservacao(day.observacao || '');
    setIsEditing(false);
  };

  const currentStatus = statusOptions.find(opt => opt.value === status);

  return (
    <div className={`border-2 p-3 rounded-lg ${currentStatus?.color || 'bg-blue-100 border-blue-500'}`}>
      {!isEditing ? (
        // Modo visualização
        <div className="text-center">
          <div className="font-bold text-lg mb-1">{day.dia}</div>
          <div className="text-sm font-medium mb-2 capitalize">{currentStatus?.label}</div>
          {day.observacao && (
            <div className="text-xs text-gray-600 mb-2" title={day.observacao}>
              ⓘ {day.observacao}
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Editar
          </button>
        </div>
      ) : (
        // Modo edição
        <div className="space-y-2">
          <div className="font-bold text-center">{day.dia}</div>
          
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-1 border rounded text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Observação (opcional)"
            className="w-full p-1 border rounded text-sm"
          />
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySettingsCard;