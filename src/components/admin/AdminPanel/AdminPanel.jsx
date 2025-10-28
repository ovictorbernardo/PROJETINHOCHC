// src/components/admin/AdminPanel/AdminPanel.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// ✅ IMPORTS MODULARES ATUALIZADOS
import AdminTabs from './AdminTabs';
import MonthController from '../Availability/MonthController';
import CalendarSettings from '../Management/CalendarSettings/CalendarSettings';
import BookingsManager from '../Management/BookingsManager/BookingsManager';

// ✅ IMPORTS COM CAMINHOS CORRETOS
import { selectCurrentAgenda, selectCurrentMesAno } from '../../../store/slices/agendaSlice';
import { selectAllBookings } from '../../../store/slices/bookingSlice';
import { getNomeMes } from '../../../utils/initialData';

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

      {/* MonthController */}
      <div className="border-b">
        <MonthController 
          mesAno={currentMesAno}
          mesDisponivel={mesDisponivel}
          onToggleDisponibilidade={onToggleDisponibilidade}
        />
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b">
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="p-6">
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            {/* ✅ APENAS CONFIGURAÇÕES DETALHADAS (única fonte de verdade) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                ⚙️ Configuração da Agenda - {nomeMes} de {ano}
              </h3>
              <p className="text-gray-600 mb-4">
                💡 <strong>Clique em "⚙️ Horários"</strong> em qualquer card para editar horários customizáveis e lotação
              </p>
              <CalendarSettings
                agenda={agenda}
                mesAno={currentMesAno}
              />
            </div>
          </div>
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