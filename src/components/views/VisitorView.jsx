// src/components/views/VisitorView.jsx - ADAPTADO
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from '../common/Calendar/Calendar';
import AdvancedBookingForm from '../user/Booking/AdvancedBookingForm';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { setSelectedDay } from '../../store/slices/uiSlice';
import { useAgenda } from '../../hooks/useAgenda';
import { selectCurrentMesAno } from '../../store/slices/agendaSlice';

const VisitorView = () => {
  const dispatch = useDispatch();
  
  const currentMesAno = useSelector(selectCurrentMesAno);
  const selectedDay = useSelector(state => state.ui?.selectedDay);

  const { agenda, loading, error, refetch } = useAgenda(currentMesAno);

  useEffect(() => {
    console.log('📊 VisitorView:', { currentMesAno, selectedDay });
  }, [currentMesAno, selectedDay]);

  const handleDaySelect = (dayInfo) => {
    console.log('📅 Dia selecionado no VisitorView:', dayInfo);
    
    if (!dayInfo || typeof dayInfo !== 'object') {
      console.error('❌ DayInfo inválido:', dayInfo);
      return;
    }

    // 🎯 PASSAR TODAS AS INFORMAÇÕES DO DAYCARD
    dispatch(setSelectedDay({
      ...dayInfo,
      mesAno: currentMesAno,
      horariosDisponiveis: dayInfo.horariosDisponiveis || [] // 🆕 HORÁRIOS DO DAYCONFIGSERVICE
    }));
  };

  const handleBookingSuccess = () => {
    console.log('✅ Agendamento realizado com sucesso!');
    dispatch(setSelectedDay(null));
    refetch();
  };

  const handleBookingCancel = () => {
    console.log('❌ Agendamento cancelado');
    dispatch(setSelectedDay(null));
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <LoadingSpinner message="Carregando calendário..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={`Erro ao carregar calendário: ${error}`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="visitor-view">
      {/* 🎯 CABEÇALHO BONITO ORIGINAL */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Agendamento de Visitação
        </h1>
        <p className="text-gray-600 text-lg">
          Quartel Central do Corpo de Bombeiros
        </p>
      </div>

      {/* 🗓️ CALENDÁRIO */}
      <div className="calendar-wrapper">
        <Calendar
          mesAno={currentMesAno}
          onDayClick={handleDaySelect}
          selectedDay={selectedDay}
          isAdmin={false} // 👤 VISITANTE NORMAL
        />
      </div>

      {/* 📋 FORMULÁRIO DE AGENDAMENTO */}
      {selectedDay && selectedDay.horariosDisponiveis && selectedDay.horariosDisponiveis.length > 0 && (
        <div className="mt-8">
          <AdvancedBookingForm
            selectedDay={selectedDay}
            mesAno={currentMesAno}
            onBookingSuccess={handleBookingSuccess}
            onCancel={handleBookingCancel}
          />
        </div>
      )}

      {/* ℹ️ LEGENDA */}
      {!selectedDay && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3 text-lg">Como agendar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span>Dias disponíveis para agendamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
              <span>Dias indisponíveis ou lotados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
              <span>Domingos e feriados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
              <span>Carregando disponibilidade</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorView;