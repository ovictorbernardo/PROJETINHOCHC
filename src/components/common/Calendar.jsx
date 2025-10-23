import React from 'react';

const Calendar = ({ mesAno, dias, onDaySelect, selectedDay, isAdmin = false }) => {
  const getDayStatusColor = (status) => {
    const colors = {
      disponivel: 'bg-green-100 border-green-500 hover:bg-green-200',
      lotado: 'bg-red-100 border-red-500',
      fechado: 'bg-gray-100 border-gray-500',
      indisponivel: 'bg-yellow-100 border-yellow-500'
    };
    return colors[status] || 'bg-blue-100 border-blue-500';
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

  const handleDayClick = (diaInfo) => {
    if (!isAdmin) {
      if (diaInfo.status === 'indisponivel') {
        alert('🔒 Este mês não está disponível para agendamentos no momento.');
        return;
      }
      if (diaInfo.status !== 'disponivel') {
        if (diaInfo.status === 'fechado') {
          alert('🚫 Este dia está fechado para agendamentos.');
        } else if (diaInfo.status === 'lotado') {
          alert('📦 Este dia está lotado. Não há vagas disponíveis.');
        }
        return;
      }
    }
    
    if (onDaySelect) {
      onDaySelect(diaInfo);
    }
  };

  // Verificar se o mês está disponível (pelo menos um dia disponível)
  const mesDisponivel = dias.some(dia => dia.status === 'disponivel');

  return (
    <div className="calendar">
      {/* Banner de status do mês */}
      {!isAdmin && !mesDisponivel && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 text-lg mr-2">⏸️</span>
            <div>
              <p className="text-yellow-800 font-semibold">
                Mês Bloqueado para Agendamentos
              </p>
              <p className="text-yellow-700 text-sm">
                Este mês não está disponível para reservas no momento.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
          <div key={dia} className="text-center font-semibold text-gray-600 py-2">
            {dia}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dias.map(diaInfo => (
          <div
            key={diaInfo.dia}
            className={`
              border-2 p-2 rounded text-center cursor-pointer min-h-16
              ${getDayStatusColor(diaInfo.status)}
              ${selectedDay === diaInfo.dia ? 'ring-2 ring-blue-500' : ''}
              ${
                !isAdmin && diaInfo.status !== 'disponivel' 
                  ? 'cursor-not-allowed opacity-70' 
                  : 'hover:shadow-md'
              }
            `}
            onClick={() => handleDayClick(diaInfo)}
            title={`${getDayStatusText(diaInfo.status)}${
              diaInfo.observacao ? ` - ${diaInfo.observacao}` : ''
            }`}
          >
            <div className="font-bold">{diaInfo.dia}</div>
            {diaInfo.observacao && (
              <div className="text-xs truncate" title={diaInfo.observacao}>
                ⓘ
              </div>
            )}
            {!mesDisponivel && !isAdmin && (
              <div className="text-xs text-red-600" title="Mês bloqueado">
                🔒
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;