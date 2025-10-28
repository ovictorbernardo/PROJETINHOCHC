// src/core/handlers/availabilityHandler.js - CORRIGIDO
import { setMesDisponivel } from '../../store/slices/agendaSlice.js';
import { toggleMonthAvailability } from '../../domain/usecases/toggleMonthAvailability.js';
import { loadAgendaIntegration } from '../integration/agendaIntegration.js';

/**
 * Handler para toggle de disponibilidade - CORRIGIDO
 */
const handleToggleDisponibilidade = ({ dispatch, currentMesAno, setError }) => {
  return async (liberar) => {
    try {
      setError(null);

      // 🎯 DOMAIN LAYER
      const result = await toggleMonthAvailability(currentMesAno, liberar);
      
      // 🎯 REDUX LAYER
      dispatch(setMesDisponivel({ mesAno: currentMesAno, disponivel: result.disponivel }));

      // 🎯 INTEGRATION LAYER - Nome correto
      await loadAgendaIntegration(currentMesAno);

      alert(result.disponivel ? '✅ Mês liberado!' : '⏸️ Mês bloqueado!');
      return { success: true };
    } catch (err) {
      console.error('❌ Handler Error - availability:', err);
      setError('Erro ao alterar disponibilidade do mês');
      return { success: false, error: err };
    }
  };
};

export default handleToggleDisponibilidade;