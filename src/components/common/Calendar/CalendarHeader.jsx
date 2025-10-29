// src/components/common/Calendar/CalendarHeader.jsx - VERSÃO ORIGINAL
import React from 'react';

const CalendarHeader = ({ mesAno, weekDays }) => {
  const getMesAnoFormatado = () => {
    if (!mesAno) return 'Calendário';
    
    const [mes, ano] = mesAno.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const nomeMes = meses[parseInt(mes) - 1] || 'Mês';
    return `${nomeMes} de ${ano}`;
  };

  return (
    <div className="calendar-header">
      <h2>{getMesAnoFormatado()}</h2>
      <p>Selecione um dia disponível para agendar sua visita</p>
      
      <div className="week-days">
        {weekDays.map(day => (
          <div key={day} className="week-day">{day}</div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;