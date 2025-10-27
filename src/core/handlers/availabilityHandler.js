import { setMesDisponivel, fetchAgendaData } from '../../store/slices/agendaSlice';
import { bloquearMes, liberarMes } from '../../utils/initialData';

export const handleToggleDisponibilidade = ({ dispatch, currentMesAno, setError }) => {
  return async (liberar) => {
    try {
      if (setError) setError(null);

      if (liberar) {
        await liberarMes(currentMesAno);
        dispatch(setMesDisponivel({ mesAno: currentMesAno, disponivel: true }));
      } else {
        await bloquearMes(currentMesAno);
        dispatch(setMesDisponivel({ mesAno: currentMesAno, disponivel: false }));
      }

      await dispatch(fetchAgendaData(currentMesAno));
      alert(liberar ? '✅ Mês liberado para agendamentos!' : '⏸️ Mês bloqueado para novos agendamentos!');
      return { success: true };
    } catch (err) {
      console.error('Erro ao alterar disponibilidade:', err);
      if (setError) setError('Erro ao alterar disponibilidade do mês');
      return { success: false, error: err };
    }
  };
};
export default handleToggleDisponibilidade;
