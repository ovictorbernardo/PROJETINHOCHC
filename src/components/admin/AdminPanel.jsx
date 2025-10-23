import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminCalendarSettings from './AdminCalendarSettings';
import BookingsManager from './BookingsManager';
import MonthController from './MonthController';

// ✅ IMPORTS COM CAMINHOS CORRETOS
import { selectCurrentAgenda, selectCurrentMesAno } from '../../store/slices/agendaSlice';
import { selectAllBookings } from '../../store/slices/bookingSlice';
import { getNomeMes } from '../../utils/initialData';

const AdminPanel = ({ mesAno, onToggleDisponibilidade }) => {
  const [activeTab, setActiveTab] = useState('agenda');
  
  // Selectors
  const agenda = useSelector(selectCurrentAgenda);
  const currentMesAno = useSelector(selectCurrentMesAno);
  const bookings = useSelector(selectAllBookings);
  
  const [mes, ano] = currentMesAno.split('-').map(Number);
  const nomeMes = getNomeMes(mes);
  const mesDisponivel = agenda.meta?.disponivel || false;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header do Mês no Admin */}
      <div className="border-b p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Administração - {nomeMes} de {ano}
            </h2>
            <p className="text-sm text-gray-600">
              {agenda.meta?.diasNoMes || '...'} dias • 
              Status: <span className={mesDisponivel ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {mesDisponivel ? 'Liberado' : 'Bloqueado'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Controle de Disponibilidade Mensal */}
      <div className="border-b">
        <MonthController 
          mesAno={currentMesAno}
          mesDisponivel={mesDisponivel}
          onToggleDisponibilidade={onToggleDisponibilidade}
        />
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'agenda'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📅 Configurar Agenda
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'reservas'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Gerenciar Reservas
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'agenda' && (
          <AdminCalendarSettings
            agenda={agenda}
            mesAno={currentMesAno}
          />
        )}

        {activeTab === 'reservas' && (
          <BookingsManager
            bookings={bookings}
            mesAno={currentMesAno}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;