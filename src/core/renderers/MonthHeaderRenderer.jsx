// src/core/renderers/MonthHeaderRenderer.jsx
import React from 'react';
import MonthNavigation from '../../components/common/Navigation/MonthNavigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { getNomeMes } from '../../utils/initialData';

/**
 * Renderer SOLID para o header do mês
 */
export const MonthHeaderRenderer = ({
  currentMesAno,
  agenda,
  agendaLoading,
  bookingsLoading,
  error,
  agendaError,
  currentView,
  isAdmin,
  onMesAnterior,
  onProximoMes,
  onMesAtual,
  onToggleDisponibilidade,
  onRetry
}) => {
  const [mes, ano] = currentMesAno.split('-').map(Number);
  const nomeMes = getNomeMes(mes);
  const mesDisponivel = agenda.meta?.disponivel || false;

  /**
   * Componente interno: Controles de disponibilidade do admin
   */
  const AdminAvailabilityControls = ({ mesDisponivel, agenda, onToggleDisponibilidade }) => (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4">
      <div>
        <StatusBadge disponivel={mesDisponivel} />
        <p className="text-sm text-gray-600 mt-1">
          {mesDisponivel 
            ? 'Agendamentos abertos para este mês' 
            : 'Agendamentos fechados para este mês'
          }
        </p>
        
        {mesDisponivel && agenda.dias && (
          <p className="text-xs text-green-600 mt-1">
            📊 {agenda.dias.filter(d => d.status === 'disponivel').length} dias disponíveis
          </p>
        )}
      </div>
      
      <div className="space-x-2">
        {!mesDisponivel ? (
          <button
            onClick={() => onToggleDisponibilidade(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            ✅ Liberar Mês
          </button>
        ) : (
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

  /**
   * Componente interno: Status de disponibilidade para visitante
   */
  const VisitorAvailabilityStatus = ({ agenda }) => (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-green-600 text-lg mr-2">✅</span>
          <div>
            <p className="text-green-800 font-semibold">
              Mês Liberado para Agendamentos
            </p>
            <p className="text-green-700 text-sm">
              {agenda.dias.filter(d => d.status === 'disponivel').length} dias disponíveis - 
              Clique em um dia verde para reservar.
            </p>
          </div>
        </div>
        <div className="text-green-600 text-sm font-semibold">
          🟢 DISPONÍVEL
        </div>
      </div>
    </div>
  );

  /**
   * Componente interno: Badge de status
   */
  const StatusBadge = ({ disponivel }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      disponivel 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        disponivel ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      {disponivel ? 'Mês Liberado' : 'Mês Bloqueado'}
    </span>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Loading State */}
      {(agendaLoading || bookingsLoading) && (
        <div className="mb-4">
          <LoadingSpinner text="Carregando dados..." />
        </div>
      )}

      {/* Error State */}
      {(error || agendaError) && (
        <div className="mb-4">
          <ErrorMessage 
            message={error || agendaError} 
            onRetry={onRetry}
          />
        </div>
      )}

      {/* Navegação do Mês */}
      <MonthNavigation
        currentMesAno={currentMesAno}
        onMesAnterior={onMesAnterior}
        onProximoMes={onProximoMes}
        onMesAtual={onMesAtual}
      />

      {/* Controles de Admin - Só mostra se for admin logado */}
      {currentView === 'admin' && isAdmin && (
        <AdminAvailabilityControls 
          mesDisponivel={mesDisponivel}
          agenda={agenda}
          onToggleDisponibilidade={onToggleDisponibilidade}
        />
      )}

      {/* Status para Visitante */}
      {currentView === 'visitante' && mesDisponivel && agenda.dias && (
        <VisitorAvailabilityStatus 
          agenda={agenda}
        />
      )}
    </div>
  );
};