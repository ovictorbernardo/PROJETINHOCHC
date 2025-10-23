import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/common/Layout';
import Calendar from './components/common/Calendar';
import BookingForm from './components/user/BookingForm';
import AdminPanel from './components/admin/AdminPanel';
import UserBookings from './components/user/UserBookings';

// ✅ IMPORTS CORRETOS
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
import { 
  getMesAnoAtual, 
  getProximoMes, 
  getMesAnterior, 
  getNomeMes, 
  getAgendaByMesAno,
  liberarMes,
  bloquearMes
} from './utils/initialData';

const App = () => {
  const dispatch = useDispatch();
  
  // ✅ SELECTORS CORRETOS
  const currentView = useSelector(selectCurrentView);
  const selectedDay = useSelector(selectSelectedDay);
  const bookingFormLoading = useSelector(selectBookingFormLoading);
  const currentMesAno = useSelector(selectCurrentMesAno);
  const agenda = useSelector(selectCurrentAgenda);
  const bookingsLoading = useSelector(selectBookingsLoading);

  // Carregar agenda quando o mês mudar
  useEffect(() => {
    const agendaData = getAgendaByMesAno(currentMesAno);
    dispatch(loadAgenda({ mesAno: currentMesAno, agenda: agendaData }));
  }, [dispatch, currentMesAno]);

  // Navegação entre meses
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

  // Controle de disponibilidade do mês
  const handleToggleDisponibilidade = (liberar) => {
    if (liberar) {
      liberarMes(currentMesAno);
    } else {
      bloquearMes(currentMesAno);
    }
    
    const novaAgenda = getAgendaByMesAno(currentMesAno);
    dispatch(setMesDisponivel({ 
      mesAno: currentMesAno, 
      disponivel: liberar 
    }));
    dispatch(loadAgenda({ mesAno: currentMesAno, agenda: novaAgenda }));
    
    if (liberar) {
      alert(`✅ Mês liberado para agendamentos!`);
    } else {
      alert(`⏸️ Mês bloqueado para novos agendamentos!`);
    }
  };

  const handleDaySelect = (day) => {
    if (currentView === 'visitante' && day.status === 'disponivel') {
      dispatch(setSelectedDay(day));
    } else if (currentView === 'visitante') {
      if (day.status === 'indisponivel') {
        alert('🔒 Este mês não está disponível para agendamentos.');
      } else if (day.status === 'fechado') {
        alert('🚫 Este dia está fechado.');
      } else if (day.status === 'lotado') {
        alert('📦 Este dia está lotado.');
      }
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    dispatch(setBookingFormLoading(true));
    dispatch(setBookingsLoading(true));
    
    try {
      // Simular criação de booking
      const mockBooking = {
        ...bookingData,
        id: Date.now().toString(),
        status: 'pendente',
        createdAt: new Date().toISOString()
      };
      
      dispatch(addBooking(mockBooking));
      dispatch(setSelectedDay(null));
      alert('Agendamento realizado com sucesso! Aguarde confirmação por email.');
    } catch (error) {
      alert('Erro ao realizar agendamento. Tente novamente.');
    } finally {
      dispatch(setBookingFormLoading(false));
      dispatch(setBookingsLoading(false));
    }
  };

  const handleViewChange = (view) => {
    dispatch(setCurrentView(view));
    dispatch(setSelectedDay(null));
  };

  // Header com navegação de meses
  const renderMonthHeader = () => {
    const [mes, ano] = currentMesAno.split('-').map(Number);
    const nomeMes = getNomeMes(mes);
    const isCurrentMonth = currentMesAno === getMesAnoAtual();
    const mesDisponivel = agenda.meta?.disponivel || false;

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMesAnterior}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ◀ Mês Anterior
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {nomeMes} de {ano}
              </h2>
              <p className="text-sm text-gray-600">
                {agenda.meta?.diasNoMes || '...'} dias • Museu CBMERJ
              </p>
            </div>
            
            <button
              onClick={handleProximoMes}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Próximo Mês ▶
            </button>
          </div>

          {!isCurrentMonth && (
            <button
              onClick={handleMesAtual}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Voltar ao Mês Atual
            </button>
          )}
        </div>

        {/* Controle de disponibilidade */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              mesDisponivel 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                mesDisponivel ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {mesDisponivel ? 'Mês Liberado' : 'Mês Bloqueado'}
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {mesDisponivel 
                ? 'Agendamentos abertos para este mês' 
                : 'Agendamentos fechados para este mês'
              }
            </p>
          </div>
          
          <div className="space-x-2">
            {!mesDisponivel && (
              <button
                onClick={() => handleToggleDisponibilidade(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ✅ Liberar Mês
              </button>
            )}
            {mesDisponivel && (
              <button
                onClick={() => handleToggleDisponibilidade(false)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⏸️ Bloquear Mês
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Conteúdo principal baseado na view atual
  const renderContent = () => {
    switch (currentView) {
      case 'visitante':
        return (
          <>
            {renderMonthHeader()}
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <Calendar
                mesAno={currentMesAno}
                dias={agenda.dias || []}
                onDaySelect={handleDaySelect}
                selectedDay={selectedDay?.dia}
              />
            </div>

            {selectedDay && (
              <BookingForm
                selectedDay={selectedDay}
                mesAno={currentMesAno}
                onSubmit={handleBookingSubmit}
                onCancel={() => dispatch(setSelectedDay(null))}
                loading={bookingFormLoading}
              />
            )}
          </>
        );

      case 'admin':
        return (
          <>
            {renderMonthHeader()}
            <AdminPanel
              mesAno={currentMesAno}
              agenda={agenda}
              onToggleDisponibilidade={handleToggleDisponibilidade}
            />
          </>
        );

      case 'meus-agendamentos':
        return <UserBookings mesAno={currentMesAno} />;

      default:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800">View não encontrada</h2>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {renderContent()}
    </Layout>
  );
};

export default App;