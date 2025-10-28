// src/core/renderers/ViewContentRenderer.jsx
import React from 'react';
import VisitorView from '../../components/views/VisitorView';
import AdminView from '../../components/views/AdminView';
import UserBookingsView from '../../components/views/UserBookingsView';
import ErrorMessage from '../../components/ui/ErrorMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * Renderer SOLID para o conteúdo das views
 */
export const ViewContentRenderer = ({ 
  state,
  onBookingSubmit,
  onDaySelect,
  onToggleDisponibilidade
}) => {
  const {
    currentView,
    agenda,
    selectedDay,
    bookingFormLoading,
    currentMesAno,
    agendaLoading,
    bookingsLoading,
    agendaError,
    isAdmin
  } = state;

  // Loading state global
  if ((agendaLoading || bookingsLoading) && !agenda.dias) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" text="Carregando sistema..." />
      </div>
    );
  }

  // Error state global
  if (agendaError && !agenda.dias) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <ErrorMessage 
          title="Erro ao carregar"
          message={agendaError}
          onRetry={state.actions?.handleRetry}
        />
      </div>
    );
  }

  // Router de views
  switch (currentView) {
    case 'visitante':
      return (
        <VisitorView
          currentMesAno={currentMesAno}
          agenda={agenda}
          selectedDay={selectedDay}
          bookingFormLoading={bookingFormLoading}
          onBookingSubmit={onBookingSubmit}
          onDaySelect={onDaySelect}
        />
      );

    case 'admin':
      // Se não for admin, não mostra o conteúdo admin
      if (!isAdmin) {
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
            <p className="text-gray-600">Você não tem permissão para acessar o painel administrativo.</p>
          </div>
        );
      }
      return (
        <AdminView
          currentMesAno={currentMesAno}
          agenda={agenda}
          onToggleDisponibilidade={onToggleDisponibilidade}
        />
      );

    case 'meus-agendamentos':
      return <UserBookingsView mesAno={currentMesAno} />;

    default:
      return (
        <ErrorMessage 
          title="View não encontrada" 
          message="A view selecionada não existe."
          onRetry={() => window.location.reload()}
        />
      );
  }
};