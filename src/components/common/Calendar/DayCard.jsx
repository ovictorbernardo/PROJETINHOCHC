// src/components/common/Calendar/DayCard.jsx — VERSÃO INTEGRADA + VISUAL MINIMALISTA
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { DayConfigService } from '../../../services/dayConfigService';

const DayCard = ({
  dayInfo,
  isSelected,
  isAdmin = false,
  onDayClick
}) => {
  const { user } = useAuth();
  const [availableHorarios, setAvailableHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const dayConfigs = useSelector(state => state.agenda.dayConfigs || {});
  const currentMesAno = useSelector(state => state.agenda.currentMesAno);

  useEffect(() => {
    const loadHorariosDisponiveis = async () => {
      if (dayInfo?.dia && currentMesAno) {
        setLoading(true);
        try {
          const horarios = await DayConfigService.getAvailableHorarios(currentMesAno, dayInfo.dia);
          setAvailableHorarios(horarios);
        } catch (error) {
          console.error('❌ Erro ao carregar horários:', error);
          setAvailableHorarios([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadHorariosDisponiveis();
  }, [dayInfo, currentMesAno]);

  // 🔍 Combinar dados locais + Firebase
  const getCurrentDayConfig = () => {
    const configKey = `${currentMesAno}-${dayInfo.dia.toString().padStart(2, '0')}`;
    const firebaseConfig = dayConfigs[configKey];
    return {
      ...dayInfo,
      ...firebaseConfig,
      disponivel: availableHorarios.length > 0,
      status: availableHorarios.length > 0
        ? 'disponivel'
        : (firebaseConfig?.status || dayInfo.status || 'indisponivel'),
      horariosDisponiveis: availableHorarios
    };
  };

  const currentDayInfo = getCurrentDayConfig();

  // 🔵 Sistema de status minimalista
  const statusColors = {
    disponivel: 'bg-white hover:bg-green-50 border-green-200 text-green-800',
    lotado: 'bg-white hover:bg-red-50 border-red-200 text-red-800',
    fechado: 'bg-gray-100 border-gray-300 text-gray-500',
    indisponivel: 'bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-800',
    pausado: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const statusIcons = {
    disponivel: '✅',
    lotado: '🔴',
    fechado: '⚫',
    indisponivel: '🟡',
    pausado: '⏸️'
  };

  const statusTexts = {
    disponivel: `Disponível (${availableHorarios.length})`,
    lotado: 'Lotado',
    fechado: 'Fechado',
    indisponivel: 'Indisponível',
    pausado: 'Pausado'
  };

  const currentStatus = currentDayInfo.status || 'indisponivel';
  const color = statusColors[currentStatus] || statusColors.indisponivel;
  const icon = statusIcons[currentStatus] || statusIcons.indisponivel;
  const text = statusTexts[currentStatus] || statusTexts.indisponivel;

  const isToday = currentDayInfo.isToday;
  const isDomingo = currentDayInfo.ehDomingo;
  const isPassado = currentDayInfo.ehPassado;

  const handleClick = () => {
    if (!isAdmin) {
      switch (currentStatus) {
        case 'indisponivel':
          alert('🔒 Este mês não está disponível para agendamentos.');
          return;
        case 'fechado':
          alert(isDomingo ? '🚫 Domingo - Museu fechado.' : '🚫 Este dia está fechado.');
          return;
        case 'lotado':
          alert('📦 Este dia está lotado.');
          return;
        case 'disponivel':
          break;
        default:
          alert('⚠️ Este dia não está disponível.');
          return;
      }
    }

    if (onDayClick) {
      onDayClick({
        ...currentDayInfo,
        status: currentStatus,
        disponivel: currentStatus === 'disponivel',
        horariosDisponiveis: availableHorarios
      });
    }
  };

  const canInteract = isAdmin || currentStatus === 'disponivel';

  const selectedStyle = isSelected
    ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
    : '';

  const todayStyle = isToday ? 'ring-2 ring-blue-500 ring-offset-2' : '';

  return (
    <div
      className={`
        relative border rounded-lg p-3
        transition-all duration-200 cursor-pointer group
        ${color} ${todayStyle} ${selectedStyle}
        ${!canInteract ? 'cursor-not-allowed opacity-70' : ''}
        h-24 flex flex-col
      `}
      onClick={canInteract ? handleClick : undefined}
      title={
        loading
          ? 'Carregando disponibilidade...'
          : currentDayInfo.observacao ||
            (isPassado
              ? 'Data passada'
              : `Status: ${text}${availableHorarios.length > 0 ? ' | Horários: ' + availableHorarios.join(', ') : ''}`)
      }
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={`
            text-lg font-semibold
            ${currentStatus === 'fechado' ? 'text-gray-400' : 'text-gray-900'}
          `}
        >
          {currentDayInfo.dia}
        </span>
        <span className="text-sm opacity-80">{icon}</span>
      </div>

      <div
        className={`
          text-xs font-medium mt-1
          ${currentStatus === 'fechado' ? 'text-gray-400' : ''}
          ${currentStatus === 'disponivel' ? 'text-green-600' : ''}
          ${currentStatus === 'lotado' ? 'text-red-600' : ''}
          ${currentStatus === 'indisponivel' ? 'text-yellow-600' : ''}
          ${currentStatus === 'pausado' ? 'text-blue-600' : ''}
        `}
      >
        {text}
      </div>

      {isToday && (
        <div className="absolute top-1 right-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Hoje
          </span>
        </div>
      )}

      {currentStatus === 'disponivel' && (
        <div className="absolute inset-0 rounded-lg bg-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
      )}
    </div>
  );
};

export default DayCard;
