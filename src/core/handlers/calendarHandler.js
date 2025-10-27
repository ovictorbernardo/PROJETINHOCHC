import { setSelectedDay } from '../../store/slices/uiSlice';

export const handleDaySelect = ({ dispatch, currentView, alertFn }) => {
  return (day) => {
    if (currentView === 'visitante' && day.status === 'disponivel') {
      dispatch(setSelectedDay(day));
      return { selected: true };
    }

    if (currentView === 'visitante') {
      const messages = {
        indisponivel: '🔒 Este mês não está disponível para agendamentos.',
        fechado: '🚫 Este dia está fechado.',
        lotado: '📦 Este dia está lotado.'
      };
      (alertFn || alert)(messages[day.status] || 'Dia não disponível para agendamento.');
    }
    return { selected: false };
  };
};
export default handleDaySelect;
