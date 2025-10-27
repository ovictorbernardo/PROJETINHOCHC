// src/components/common/Calendar/DayCard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';

const DayCard = ({ 
  dayInfo, 
  isSelected, 
  isAdmin = false, 
  onDayClick 
}) => {
  const { user } = useAuth();
  
  // 🎯 BUSCAR DADOS EM TEMPO REAL DO REDUX/FIREBASE
  const dayConfigs = useSelector(state => state.agenda.dayConfigs || {});
  const currentMesAno = useSelector(state => state.agenda.currentMesAno);
  
  // 🔄 OBTER CONFIGURAÇÃO MAIS ATUALIZADA DO DIA
  const getCurrentDayConfig = () => {
    const configKey = `${currentMesAno}-${dayInfo.dia.toString().padStart(2, '0')}`;
    const firebaseConfig = dayConfigs[configKey];
    
    // Priorizar configuração do Firebase, fallback para dayInfo
    return firebaseConfig || dayInfo;
  };

  const currentDayInfo = getCurrentDayConfig();

  // 🎨 SISTEMA DE CORES SINCRONIZADO
  const getDayStatusColor = (status) => {
    const colors = {
      disponivel: 'bg-green-50 border-green-300 hover:bg-green-100 text-green-800',
      lotado: 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100',
      fechado: 'bg-gray-100 border-gray-300 text-gray-600',
      indisponivel: 'bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100'
    };
    return colors[status] || 'bg-blue-50 border-blue-300 text-blue-800';
  };

  // 🎯 SISTEMA DE ÍCONES SINCRONIZADO
  const getDayStatusIcon = (status) => {
    const icons = {
      disponivel: '🟢',
      lotado: '🔴', 
      fechado: '⚫',
      indisponivel: '🟡'
    };
    return icons[status] || '🔵';
  };

  // 📝 SISTEMA DE TEXTO SINCRONIZADO
  const getDayStatusText = (status) => {
    const texts = {
      disponivel: 'Disponível',
      lotado: 'Lotado', 
      fechado: 'Fechado',
      indisponivel: 'Indisponível'
    };
    return texts[status] || status;
  };

  // 🔍 OBTER STATUS ATUAL CONSISTENTE
  const getCurrentStatus = () => {
    // Verificar se há configuração específica do Firebase
    if (currentDayInfo.status) {
      return currentDayInfo.status;
    }
    
    // Fallback para lógica local
    if (currentDayInfo.disponivel === false) return 'fechado';
    if (currentDayInfo.lotado) return 'lotado';
    if (currentDayInfo.disponivel === true) return 'disponivel';
    
    return 'indisponivel';
  };

  const currentStatus = getCurrentStatus();
  const isDomingo = currentDayInfo.ehDomingo;
  const isPassado = currentDayInfo.ehPassado;

  // 🖱️ MANIPULADOR DE CLIQUE MELHORADO
  const handleClick = () => {
    console.log('📅 Dia clicado:', {
      dia: currentDayInfo.dia,
      status: currentStatus,
      isAdmin,
      config: currentDayInfo
    });

    if (!isAdmin) {
      // 👤 COMPORTAMENTO PARA USUÁRIO COMUM
      switch (currentStatus) {
        case 'indisponivel':
          alert('🔒 Este mês não está disponível para agendamentos no momento.');
          return;
        
        case 'fechado':
          if (isDomingo) {
            alert('🚫 Domingo - Museu fechado.');
          } else {
            alert('🚫 Este dia está fechado para agendamentos.');
          }
          return;
        
        case 'lotado':
          alert('📦 Este dia está lotado. Não há vagas disponíveis.');
          return;
        
        case 'disponivel':
          // Permitir clique - dia disponível
          break;
        
        default:
          alert('⚠️ Este dia não está disponível para agendamento.');
          return;
      }
    }
    
    // 🎯 CHAMAR CALLBACK COM INFORMAÇÕES ATUALIZADAS
    if (onDayClick) {
      onDayClick({
        ...currentDayInfo,
        status: currentStatus,
        disponivel: currentStatus === 'disponivel'
      });
    }
  };

  // 📱 TOOLTIP DINÂMICO
  const getTooltipText = () => {
    const baseText = getDayStatusText(currentStatus);
    
    if (currentDayInfo.observacao) {
      return `${baseText} - ${currentDayInfo.observacao}`;
    }
    
    if (isDomingo) {
      return `${baseText} - Domingo (fechado)`;
    }
    
    if (isPassado) {
      return `${baseText} - Data passada`;
    }
    
    return baseText;
  };

  // 🔄 VERIFICAR SE PODE INTERAGIR
  const canInteract = isAdmin || currentStatus === 'disponivel';

  return (
    <div
      className={`
        border-2 p-2 rounded-lg text-center cursor-pointer min-h-16
        transition-all duration-200 ease-in-out flex flex-col
        ${getDayStatusColor(currentStatus)}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-lg' : ''}
        ${
          !canInteract 
            ? 'cursor-not-allowed opacity-70 grayscale-30' 
            : 'hover:shadow-md hover:scale-105 hover:border-blue-400'
        }
        ${currentDayInfo.sincronizado ? 'border-dashed' : 'border-solid'}
      `}
      onClick={handleClick}
      title={getTooltipText()}
    >
      {/* NÚMERO DO DIA */}
      <div className="font-bold text-lg flex justify-between items-start">
        <span>{currentDayInfo.dia}</span>
        
        {/* INDICADOR DE SINCRONIZAÇÃO */}
        {currentDayInfo.sincronizado && (
          <span className="text-xs" title="Sincronizado com nuvem">☁️</span>
        )}
      </div>

      {/* STATUS E ÍCONE */}
      <div className="flex items-center justify-center gap-1 mt-1 flex-grow">
        <span className="text-lg">{getDayStatusIcon(currentStatus)}</span>
        <span className="text-xs hidden sm:inline">
          {getDayStatusText(currentStatus)}
        </span>
      </div>

      {/* INFORMAÇÕES EXTRAS */}
      <div className="mt-auto">
        {/* CONTADOR DE AGENDAMENTOS */}
        {currentDayInfo.agendamentosCount > 0 && (
          <div className="text-xs bg-blue-100 text-blue-800 rounded px-1 mb-1">
            📋 {currentDayInfo.agendamentosCount}
          </div>
        )}
        
        {/* OBSERVAÇÃO */}
        {currentDayInfo.observacao && (
          <div 
            className="text-xs opacity-75 truncate" 
            title={currentDayInfo.observacao}
          >
            ⓘ {currentDayInfo.observacao}
          </div>
        )}
        
        {/* INDICADORES ESPECIAIS */}
        <div className="flex justify-center gap-1 mt-1">
          {isDomingo && (
            <span className="text-xs" title="Domingo">📅</span>
          )}
          {isPassado && (
            <span className="text-xs" title="Data passada">⏰</span>
          )}
          {currentDayInfo.lotado && (
            <span className="text-xs" title="Lotado">👥</span>
          )}
        </div>
      </div>

      {/* DEBUG - APENAS DESENVOLVIMENTO */}
      {process.env.NODE_ENV === 'development' && isAdmin && (
        <div className="text-[6px] opacity-50 mt-1">
          {currentDayInfo.sincronizado ? 'CLOUD' : 'LOCAL'}
        </div>
      )}
    </div>
  );
};

// 🎯 MEMO PARA OTIMIZAÇÃO DE RENDERIZAÇÃO
export default React.memo(DayCard, (prevProps, nextProps) => {
  // Evitar re-render desnecessário se apenas isSelected mudar
  return (
    prevProps.dayInfo?.status === nextProps.dayInfo?.status &&
    prevProps.dayInfo?.disponivel === nextProps.dayInfo?.disponivel &&
    prevProps.dayInfo?.lotado === nextProps.dayInfo?.lotado &&
    prevProps.dayInfo?.observacao === nextProps.dayInfo?.observacao &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isAdmin === nextProps.isAdmin
  );
});