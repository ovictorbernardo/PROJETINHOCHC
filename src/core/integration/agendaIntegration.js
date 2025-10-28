// src/core/integration/agendaIntegration.js
import { getAgendaByMonth } from '../../domain/usecases/getAgendaByMonth.js';
import { store } from '../../store/index.js';

export const loadAgendaIntegration = async (mesAno) => {
  try {
    console.log('🎯 SOLID Integration - Carregando agenda:', mesAno);
    
    // 🎯 DOMAIN LAYER
    const agendaData = await getAgendaByMonth(mesAno);
    
    // 🎯 REDUX LAYER - Usar thunk existente
    const result = await store.dispatch({
      type: 'agenda/fetchAgendaData/fulfilled', 
      payload: { mesAno, agendaData } 
    });
    
    return { success: true, data: agendaData };
  } catch (error) {
    console.error('❌ Integration Error:', error);
    return { success: false, error: error.message };
  }
};

export default loadAgendaIntegration;