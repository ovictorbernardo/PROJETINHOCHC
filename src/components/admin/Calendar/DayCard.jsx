// src/components/admin/Calendar/DayCard.jsx
import React from 'react';

const AdminDayCard = ({ day, diaIndex, onDaySelect }) => {
  // Status options com cores
  const statusOptions = [
    { value: 'disponivel', label: 'Disponível', color: 'bg-green-500', icon: '🟢' },
    { value: 'lotado', label: 'Lotado', color: 'bg-red-500', icon: '🔴' },
    { value: 'fechado', label: 'Fechado', color: 'bg-gray-500', icon: '⚫' },
    { value: 'indisponivel', label: 'Indisponível', color: 'bg-yellow-500', icon: '🟡' }
  ];

  // Horários padrão
  const horariosPadrao = {
    '08:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 },
    '10:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 },
    '14:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 }
  };

  /**
   * Calcula status geral baseado nos horários
   */
  const calcularStatusGeral = (horarios) => {
    const horariosArray = Object.values(horarios);
    if (horariosArray.length === 0) return 'indisponivel';
    
    const todosLotados = horariosArray.every(h => h.status === 'lotado');
    const todosFechados = horariosArray.every(h => h.status === 'fechado');
    const algumDisponivel = horariosArray.some(h => h.status === 'disponivel');

    if (todosLotados) return 'lotado';
    if (todosFechados) return 'fechado';
    if (algumDisponivel) return 'disponivel';
    return 'indisponivel';
  };

  /**
   * Renderização do status do horário
   */
  const renderStatusHorario = (horario, horarioKey) => {
    const statusInfo = statusOptions.find(opt => opt.value === horario.status);
    return (
      <div className={`px-2 py-1 rounded text-white text-xs font-medium ${statusInfo?.color} flex items-center gap-1`}>
        <span className="text-xs">{statusInfo?.icon}</span>
        <span>{horarioKey}</span>
      </div>
    );
  };

  // Status geral do dia
  const horarios = day.horarios || horariosPadrao;
  const statusGeral = calcularStatusGeral(horarios);
  const statusGeralInfo = statusOptions.find(opt => opt.value === statusGeral);

  return (
    <div 
      className={`
        border-2 rounded-lg p-3 cursor-pointer transition-all duration-200
        ${statusGeral === 'disponivel' ? 'bg-green-50 border-green-300 hover:bg-green-100' : ''}
        ${statusGeral === 'lotado' ? 'bg-red-50 border-red-300 hover:bg-red-100' : ''}
        ${statusGeral === 'fechado' ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' : ''}
        ${statusGeral === 'indisponivel' ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100' : ''}
      `}
      onClick={() => onDaySelect?.(day)}
    >
      {/* Cabeçalho do dia */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg">{day.dia}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDaySelect?.(day);
          }}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
        >
          ⚙️ Horários
        </button>
      </div>

      {/* MODO VISUALIZAÇÃO */}
      <div className="space-y-2">
        {/* Status geral */}
        <div className="flex items-center gap-2">
          <span className="text-sm">{statusGeralInfo?.icon}</span>
          <span className="text-sm font-medium capitalize">{statusGeralInfo?.label}</span>
        </div>

        {/* Lista de horários */}
        <div className="space-y-1">
          {Object.entries(horarios).map(([horarioKey, horario]) => (
            <div key={horarioKey} className="flex justify-between items-center">
              {renderStatusHorario(horario, horarioKey)}
              <div className="text-xs text-gray-600">
                {horario.lotacaoAtual}/{horario.lotacaoMaxima}
              </div>
            </div>
          ))}
        </div>

        {/* Observação */}
        {day.observacao && (
          <div className="text-xs text-gray-600 bg-white p-1 rounded border">
            📝 {day.observacao}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDayCard;