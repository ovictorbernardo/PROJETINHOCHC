import { createSlice } from '@reduxjs/toolkit';
import { getAgendaByMesAno, getMesAnoAtual } from '../../utils/initialData';

const agendaSlice = createSlice({
  name: 'agenda',
  initialState: {
    currentMesAno: getMesAnoAtual(),
    agendas: {},
    loading: false
  },
  reducers: {
    setCurrentMesAno: (state, action) => {
      state.currentMesAno = action.payload;
    },
    loadAgenda: (state, action) => {
      const { mesAno, agenda } = action.payload;
      state.agendas[mesAno] = agenda;
    },
    updateDay: (state, action) => {
      const { mesAno, diaIndex, updates } = action.payload;
      if (state.agendas[mesAno]?.dias?.[diaIndex]) {
        state.agendas[mesAno].dias[diaIndex] = {
          ...state.agendas[mesAno].dias[diaIndex],
          ...updates
        };
      }
    },
    setMesDisponivel: (state, action) => {
      const { mesAno, disponivel } = action.payload;
      if (state.agendas[mesAno]) {
        state.agendas[mesAno].meta.disponivel = disponivel;
        
        if (state.agendas[mesAno].dias) {
          state.agendas[mesAno].dias = state.agendas[mesAno].dias.map(dia => {
            if (disponivel) {
              return {
                ...dia,
                observacao: dia.observacao === 'Mês não liberado para agendamentos' ? '' : dia.observacao,
                status: dia.status === 'indisponivel' ? 'disponivel' : dia.status
              };
            } else {
              return {
                ...dia,
                status: 'indisponivel',
                observacao: 'Mês não liberado para agendamentos'
              };
            }
          });
        }
      }
    }
  }
});

export const { 
  setCurrentMesAno, 
  loadAgenda, 
  updateDay,
  setMesDisponivel
} = agendaSlice.actions;

// ✅ SELECTORS EXPORTADOS CORRETAMENTE
export const selectCurrentAgenda = (state) => 
  state.agenda.agendas[state.agenda.currentMesAno] || { dias: [] };

export const selectCurrentMesAno = (state) => state.agenda.currentMesAno;

export const selectMesDisponivel = (mesAno) => (state) => 
  state.agenda.agendas[mesAno]?.meta?.disponivel || false;

export default agendaSlice.reducer;