// src/components/admin/Availability/MonthAvailability.jsx
import React from 'react';

const MonthAvailability = ({ 
  mesDisponivel, 
  agenda, 
  onToggleDisponibilidade 
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          mesDisponivel 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            mesDisponivel ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {mesDisponivel ? 'Mês Liberado' : 'Mês Bloqueado'}
        </span>
        <p className="text-sm text-gray-600 mt-1">
          {mesDisponivel 
            ? 'Agendamentos abertos para este mês' 
            : 'Agendamentos fechados para este mês'
          }
        </p>
        
        {/* ✅ INFO: Mostrar estatísticas quando liberado */}
        {mesDisponivel && agenda.dias && (
          <p className="text-xs text-green-600 mt-1">
            📊 {agenda.dias.filter(d => d.status === 'disponivel').length} dias disponíveis
          </p>
        )}
      </div>
      
      <div className="space-x-2">
        {!mesDisponivel && (
          <button
            onClick={() => onToggleDisponibilidade(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            ✅ Liberar Mês
          </button>
        )}
        {mesDisponivel && (
          <button
            onClick={() => onToggleDisponibilidade(false)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            ⏸️ Bloquear Mês
          </button>
        )}
      </div>
    </div>
  );
};

export default MonthAvailability;