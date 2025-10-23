import React from 'react';

const DayCard = ({ dia, index, onStatusChange, onObservacaoChange }) => {
  const getStatusColor = (status) => {
    const colors = {
      disponivel: 'bg-green-500',
      lotado: 'bg-red-500', 
      fechado: 'bg-gray-500',
      indisponivel: 'bg-yellow-500'
    };
    return colors[status] || 'bg-blue-500';
  };

  const getStatusText = (status) => {
    const texts = {
      disponivel: 'Disponível',
      lotado: 'Lotado',
      fechado: 'Fechado',
      indisponivel: 'Indisponível'
    };
    return texts[status] || status;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-lg text-gray-800">Dia {dia.dia}</span>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(dia.status)}`}></div>
          <span className="text-sm text-gray-600">{getStatusText(dia.status)}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <select
          value={dia.status}
          onChange={(e) => onStatusChange(index, e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="disponivel">🟢 Disponível</option>
          <option value="lotado">🔴 Lotado</option>
          <option value="fechado">⚫ Fechado</option>
          <option value="indisponivel">🟡 Indisponível</option>
        </select>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observação:
          </label>
          <input
            type="text"
            placeholder="Ex: Banda do CBMERJ, Evento especial..."
            value={dia.observacao || ''}
            onChange={(e) => onObservacaoChange(index, e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Preview da observação */}
        {dia.observacao && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            <strong>Preview:</strong> {dia.observacao}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCard;