// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// 🎯 CONTEXTS & AUTH IMPORTS
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 🎯 COMPONENTS IMPORTS
import Layout from './components/common/Layout';
import MonthNavigation from './components/common/Navigation/MonthNavigation';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorMessage from './components/ui/ErrorMessage';

// 🎯 VIEWS IMPORTS
import VisitorView from './components/views/VisitorView';
import AdminView from './components/views/AdminView';
import UserBookingsView from './components/views/UserBookingsView';
import AdminLogin from './components/auth/AdminLogin';

// 🎯 REDUX IMPORTS
import { 
  setCurrentMesAno, 
  loadAgenda,
  setMesDisponivel,
  selectCurrentAgenda,
  selectCurrentMesAno
} from './store/slices/agendaSlice';
import { 
  addBooking,
  setBookingsLoading,
  selectBookingsLoading 
} from './store/slices/bookingSlice';
import { 
  setCurrentView, 
  setSelectedDay, 
  setBookingFormLoading,
  selectCurrentView,
  selectSelectedDay,
  selectBookingFormLoading
} from './store/slices/uiSlice';

// 🎯 UTILS IMPORTS
import { 
  getMesAnoAtual, 
  getProximoMes, 
  getMesAnterior, 
  getNomeMes, 
  getAgendaByMesAno,
  liberarMes,
  bloquearMes,
  generateAgendaLiberada
} from './utils/initialData';

// 🎯 COMPONENTE PRINCIPAL COM REDUX
const AppContent = () => {
  // ======================
  // 🎯 HOOKS & SELECTORS
  // ======================
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  
  // Redux Selectors
  const currentView = useSelector(selectCurrentView);
  const selectedDay = useSelector(selectSelectedDay);
  const bookingFormLoading = useSelector(selectBookingFormLoading);
  const currentMesAno = useSelector(selectCurrentMesAno);
  const agenda = useSelector(selectCurrentAgenda);
  const bookingsLoading = useSelector(selectBookingsLoading);

  // Local State
  const [error, setError] = useState(null);

  // ======================
  // 🎯 EFFECTS
  // ======================
  
  /**
   * Carrega agenda quando o mês muda
   */
  useEffect(() => {
    const loadAgendaData = async () => {
      try {
        setError(null);
        const agendaData = getAgendaByMesAno(currentMesAno);
        dispatch(loadAgenda({ mesAno: currentMesAno, agenda: agendaData }));
      } catch (err) {
        setError('Erro ao carregar agenda do mês');
        console.error('Erro ao carregar agenda:', err);
      }
    };

    loadAgendaData();
  }, [dispatch, currentMesAno]);

  // ======================
  // 🎯 HANDLERS - NAVEGAÇÃO
  // ======================
  
  const handleProximoMes = () => {
    const proximoMes = getProximoMes(currentMesAno);
    dispatch(setCurrentMesAno(proximoMes));
  };

  const handleMesAnterior = () => {
    const mesAnterior = getMesAnterior(currentMesAno);
    dispatch(setCurrentMesAno(mesAnterior));
  };

  const handleMesAtual = () => {
    const mesAtual = getMesAnoAtual();
    dispatch(setCurrentMesAno(mesAtual));
  };

  const handleViewChange = (view) => {
    // Se tentar acessar admin sem estar logado, redireciona para login
    if (view === 'admin' && !user) {
      window.location.href = '/admin/login';
      return;
    }
    
    dispatch(setCurrentView(view));
    dispatch(setSelectedDay(null));
    setError(null);
  };

  // ======================
  // 🎯 HANDLERS - AGENDA
  // ======================
  
  /**
   * Controla disponibilidade do mês (liberar/bloquear)
   */
  const handleToggleDisponibilidade = async (liberar) => {
    try {
      setError(null);
      
      if (liberar) {
        const agendaLiberada = generateAgendaLiberada(currentMesAno);
        liberarMes(currentMesAno);
        
        dispatch(setMesDisponivel({ 
          mesAno: currentMesAno, 
          disponivel: true,
          agenda: agendaLiberada
        }));
        dispatch(loadAgenda({ mesAno: currentMesAno, agenda: agendaLiberada }));
        
        alert(`✅ Mês liberado para agendamentos! Todos os dias estão disponíveis.`);
      } else {
        const agendaBloqueada = {
          ...agenda,
          meta: { ...agenda.meta, disponivel: false },
          dias: agenda.dias.map(dia => ({ ...dia, status: 'indisponivel' }))
        };
        
        bloquearMes(currentMesAno);
        dispatch(setMesDisponivel({ mesAno: currentMesAno, disponivel: false }));
        dispatch(loadAgenda({ mesAno: currentMesAno, agenda: agendaBloqueada }));
        
        alert(`⏸️ Mês bloqueado para novos agendamentos!`);
      }
    } catch (error) {
      setError('Erro ao alterar disponibilidade do mês');
      console.error('Erro ao alterar disponibilidade:', error);
    }
  };

  // ======================
  // 🎯 HANDLERS - CALENDÁRIO
  // ======================
  
  /**
   * Gerencia clique nos dias do calendário
   */
  const handleDaySelect = (day) => {
    if (currentView === 'visitante' && day.status === 'disponivel') {
      dispatch(setSelectedDay(day));
    } else if (currentView === 'visitante') {
      // Feedback para dias não disponíveis
      const messages = {
        indisponivel: '🔒 Este mês não está disponível para agendamentos.',
        fechado: '🚫 Este dia está fechado.',
        lotado: '📦 Este dia está lotado.'
      };
      alert(messages[day.status] || 'Dia não disponível para agendamento.');
    }
  };

  // ======================
  // 🎯 HANDLERS - AGENDAMENTOS
  // ======================
  
  /**
   * Processa submissão do formulário de agendamento
   */
  const handleBookingSubmit = async (bookingData) => {
    dispatch(setBookingFormLoading(true));
    dispatch(setBookingsLoading(true));
    
    try {
      setError(null);
      
      // 🆕 ESTRUTURA NOVA PARA ADVANCED BOOKING
      const advancedBooking = {
        ...bookingData,
        id: Date.now().toString(),
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // TODO: Integrar com Firebase quando pronto
      // await BookingService.createBooking(advancedBooking);
      
      // Temporariamente: salvar no Redux
      dispatch(addBooking(advancedBooking));
      dispatch(setSelectedDay(null));
      
      alert('✅ Agendamento realizado com sucesso! Aguarde confirmação por email.');
    } catch (error) {
      setError('Erro ao realizar agendamento');
      console.error('Erro no agendamento:', error);
      alert('❌ Erro ao realizar agendamento. Tente novamente.');
    } finally {
      dispatch(setBookingFormLoading(false));
      dispatch(setBookingsLoading(false));
    }
  };

  // ======================
  // 🎯 HANDLERS - ERROR & RETRY
  // ======================
  
  const handleRetry = () => {
    setError(null);
    // Recarregar dados
    const agendaData = getAgendaByMesAno(currentMesAno);
    dispatch(loadAgenda({ mesAno: currentMesAno, agenda: agendaData }));
  };

  // ======================
  // 🎯 RENDER FUNCTIONS
  // ======================
  
  /**
   * Renderiza header do mês com navegação e controles
   */
  const renderMonthHeader = () => {
    const [mes, ano] = currentMesAno.split('-').map(Number);
    const nomeMes = getNomeMes(mes);
    const isCurrentMonth = currentMesAno === getMesAnoAtual();
    const mesDisponivel = agenda.meta?.disponivel || false;

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Loading State */}
        {bookingsLoading && (
          <div className="mb-4">
            <LoadingSpinner text="Carregando dados..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4">
            <ErrorMessage 
              message={error} 
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* Navegação do Mês */}
        <MonthNavigation
          currentMesAno={currentMesAno}
          onMesAnterior={handleMesAnterior}
          onProximoMes={handleProximoMes}
          onMesAtual={handleMesAtual}
        />

        {/* Controles de Admin - Só mostra se for admin logado */}
        {currentView === 'admin' && isAdmin && (
          <AdminAvailabilityControls 
            mesDisponivel={mesDisponivel}
            agenda={agenda}
            nomeMes={nomeMes}
            ano={ano}
            onToggleDisponibilidade={handleToggleDisponibilidade}
          />
        )}

        {/* Status para Visitante */}
        {currentView === 'visitante' && mesDisponivel && agenda.dias && (
          <VisitorAvailabilityStatus 
            agenda={agenda}
            nomeMes={nomeMes}
            ano={ano}
          />
        )}
      </div>
    );
  };

  /**
   * Componente interno: Controles de disponibilidade do admin
   */
  const AdminAvailabilityControls = ({ mesDisponivel, agenda, nomeMes, ano, onToggleDisponibilidade }) => (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
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
  const VisitorAvailabilityStatus = ({ agenda, nomeMes, ano }) => (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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

  /**
   * Renderiza conteúdo principal baseado na view atual
   */
  const renderContent = () => {
    // Loading state global
    if (bookingsLoading && !agenda.dias) {
      return (
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="large" text="Carregando sistema..." />
        </div>
      );
    }

    // Router de views
    switch (currentView) {
      case 'visitante':
        return (
          <>
            {renderMonthHeader()}
            <VisitorView
              currentMesAno={currentMesAno}
              agenda={agenda}
              selectedDay={selectedDay}
              bookingFormLoading={bookingFormLoading}
              onBookingSubmit={handleBookingSubmit}
              onDaySelect={handleDaySelect}
            />
          </>
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
          <>
            {renderMonthHeader()}
            <AdminView
              currentMesAno={currentMesAno}
              agenda={agenda}
              onToggleDisponibilidade={handleToggleDisponibilidade}
            />
          </>
        );

      case 'meus-agendamentos':
        return <UserBookingsView mesAno={currentMesAno} />;

      default:
        return (
          <ErrorMessage 
            title="View não encontrada" 
            message="A view selecionada não existe."
            onRetry={() => handleViewChange('visitante')}
          />
        );
    }
  };

  // ======================
  // 🎯 MAIN RENDER
  // ======================
  
  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {renderContent()}
    </Layout>
  );
};

// 🎯 COMPONENTE APP PRINCIPAL COM ROTAS
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 🏠 ROTA PÚBLICA PRINCIPAL */}
            <Route path="/" element={<AppContent />} />
            
            {/* 🔐 ROTA DE LOGIN ADMIN */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* 🛡️ ROTAS PROTEGIDAS - ADMIN */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AppContent />
                </ProtectedRoute>
              } 
            />
            
            {/* 🔄 ROTA FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;