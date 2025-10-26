// src/components/common/Calendar/DayCard.jsx
import React from 'react';

const DayCard = ({ 
  dayInfo, 
  isSelected, 
  isAdmin = false, 
  onDayClick 
}) => {
  const getDayStatusColor = (status) => {
    const colors = {
      disponivel: 'bg-green-100 border-green-500 hover:bg-green-200 text-green-800',
      lotado: 'bg-red-100 border-red-500 text-red-800',
      fechado: 'bg-gray-100 border-gray-500 text-gray-800',
      indisponivel: 'bg-yellow-100 border-yellow-500 text-yellow-800'
    };
    return colors[status] || 'bg-blue-100 border-blue-500 text-blue-800';
  };

  const getDayStatusIcon = (status) => {
    const icons = {
      disponivel: '🟢',
      lotado: '🔴', 
      fechado: '⚫',
      indisponivel: '🟡'
    };
    return icons[status] || '🔵';
  };

  const getDayStatusText = (status) => {
    const texts = {
      disponivel: 'Disponível',
      lotado: 'Lotado', 
      fechado: 'Fechado',
      indisponivel: 'Indisponível'
    };
    return texts[status] || status;
  };

  const handleClick = () => {
    if (!isAdmin) {
      if (dayInfo.status === 'indisponivel') {
        alert('🔒 Este mês não está disponível para agendamentos no momento.');
        return;
      }
      if (dayInfo.status !== 'disponivel') {
        if (dayInfo.status === 'fechado') {
          alert('🚫 Este dia está fechado para agendamentos.');
        } else if (dayInfo.status === 'lotado') {
          alert('📦 Este dia está lotado. Não há vagas disponíveis.');
        }
        return;
      }
    }
    
    if (onDayClick) {
      onDayClick(dayInfo);
    }
  };

  return (
    <div
      className={`
        border-2 p-2 rounded-lg text-center cursor-pointer min-h-16
        transition-all duration-200 ease-in-out
        ${getDayStatusColor(dayInfo.status)}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : ''}
        ${
          !isAdmin && dayInfo.status !== 'disponivel' 
            ? 'cursor-not-allowed opacity-70' 
            : 'hover:shadow-md hover:scale-105'
        }
      `}
      onClick={handleClick}
      title={`${getDayStatusText(dayInfo.status)}${
        dayInfo.observacao ? ` - ${dayInfo.observacao}` : ''
      }`}
    >
      <div className="font-bold text-lg">{dayInfo.dia}</div>
      <div className="text-xs mt-1">
        <span className="mr-1">{getDayStatusIcon(dayInfo.status)}</span>
        <span className="hidden sm:inline">{getDayStatusText(dayInfo.status)}</span>
      </div>
      {dayInfo.observacao && (
        <div className="text-xs mt-1 truncate" title={dayInfo.observacao}>
          ⓘ
        </div>
      )}
    </div>
  );
};

export default DayCard;