// src/components/admin/Management/CalendarSettings/CalendarSettings.jsx
import React, { useState } from 'react';
import Calendar from '../../../common/Calendar/Calendar';
import DaySettingsCard from './DaySettingsCard';

const CalendarSettings = ({ agenda, mesAno }) => {
  const [dias, setDias] = useState(agenda.dias || []);

  const handleUpdateDay = (dia, updates) => {
    const updatedDias = dias.map(d => 
      d.dia === dia ? { ...d, ...updates } : d
    );
    setDias(updatedDias);
    // TODO: Integrar com Redux/Firebase
    console.log('Dia atualizado:', dia, updates);
  };

  const handleDaySelect = (day) => {
    // No modo admin, o clique no calendário pode abrir edição rápida
    console.log('Dia selecionado para edição:', day);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Configuração da Agenda</h3>
      <p className="text-gray-600 mb-4">
        Visualize e gerencie a disponibilidade dos dias deste mês.
      </p>
      
      {/* Calendário de Visualização */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <Calendar
          mesAno={mesAno}
          dias={dias}
          onDaySelect={handleDaySelect}
          isAdmin={true}
        />
      </div>

      {/* Grid de Configuração Individual */}
      <div>
        <h4 className="text-md font-semibold mb-3">Configuração Individual dos Dias</h4>
        <div className="grid grid-cols-7 gap-2">
          {dias.map(day => (
            <DaySettingsCard
              key={day.dia}
              day={day}
              onUpdateDay={handleUpdateDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSettings;