// src/components/admin/Management/CalendarSettings/CalendarSettings.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Calendar from '../../../common/Calendar/Calendar';
import DaySettingsCard from './DaySettingsCard';
import { useCalendarSyncManager } from '../../../../core/managers/CalendarSyncManager';

const CalendarSettings = ({ agenda, mesAno }) => {
  const dispatch = useDispatch();
  const { updateDayAndSync } = useCalendarSyncManager();
  
  const [dias, setDias] = useState(agenda.dias || []);

  // Sincroniza quando a agenda muda
  useEffect(() => {
    setDias(agenda.dias || []);
  }, [agenda]);

  /**
   * Atualiza um dia e sincroniza com o sistema
   */
  const handleUpdateDay = async (diaNumero, updates) => {
    try {
      const diaIndex = dias.findIndex(d => d.dia === diaNumero);
      if (diaIndex === -1) return false;

      // Atualização local otimista
      const updatedDias = [...dias];
      updatedDias[diaIndex] = { 
        ...updatedDias[diaIndex], 
        ...updates 
      };
      setDias(updatedDias);

      // 🔄 SINCRONIZAÇÃO
      const result = await updateDayAndSync(diaIndex, updates);
      return result.success;

    } catch (error) {
      console.error('Erro ao atualizar dia:', error);
      // Reverte para o estado original
      setDias(agenda.dias || []);
      return false;
    }
  };

  const handleDaySelect = (day) => {
    // Pode implementar edição rápida no futuro
    console.log('Dia selecionado para edição:', day);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Configuração da Agenda - {mesAno}</h3>
      <p className="text-gray-600 mb-4">
        Configure a disponibilidade por horário para cada dia. 
        <strong> Alterações são sincronizadas automaticamente.</strong>
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
        <h4 className="text-md font-semibold mb-3">Configuração por Dia e Horário</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dias.map(day => (
            <DaySettingsCard
              key={day.dia}
              day={day}
              onUpdateDay={handleUpdateDay}
              mesAno={mesAno}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSettings;