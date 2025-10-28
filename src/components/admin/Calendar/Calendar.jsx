// src/components/admin/Calendar/Calendar.jsx
import React from 'react';
import AdminDayCard from './DayCard';

const AdminCalendar = ({ mesAno, dias, onDaySelect }) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Calendário Administrativo</h3>
        <p className="text-gray-600">Clique em ⚙️ Horários para customizar os horários de cada dia</p>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
          <div key={dia} className="text-center font-semibold text-gray-700 py-2">
            {dia}
          </div>
        ))}
        
        {/* Dias do mês */}
        {dias.map((dia, index) => (
          <AdminDayCard
            key={dia.dia}
            day={dia}
            diaIndex={index}
            onDaySelect={onDaySelect}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminCalendar;