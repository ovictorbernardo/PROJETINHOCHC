// src/store/slices/agendaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadMonthData, getMesAnoAtual } from '../../utils/initialData';

// 🎯 ASYNC THUNK
export const fetchAgendaData = createAsyncThunk(
  'agenda/fetchAgendaData',
  async (mesAno, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching agenda data for:', mesAno);
      const agendaData = await loadMonthData(mesAno);
      
      if (agendaData && typeof agendaData.then === 'function') {
        throw new Error('loadMonthData retornou uma Promise em vez de dados');
      }
      
      console.log('✅ Agenda data loaded:', mesAno);
      return { mesAno, agendaData };
    } catch (error) {
      console.error('❌ Error fetching agenda:', error);
      return rejectWithValue(error.message);
    }
  }
);

const agendaSlice = createSlice({
  name: 'agenda',
  initialState: {
    currentMesAno: getMesAnoAtual(),
    agendas: {},
    loading: false,
    error: null,
    dayConfigs: {}
  },
  reducers: {
    setCurrentMesAno: (state, action) => {
      state.currentMesAno = action.payload;
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
            if (disponivel && dia.status === 'indisponivel' && !dia.ehDomingo && !dia.ehPassado) {
              return {
                ...dia,
                observacao: '',
                status: 'disponivel',
                disponivel: true
              };
            } else if (!disponivel && dia.status === 'disponivel') {
              return {
                ...dia,
                status: 'indisponivel',
                disponivel: false,
                observacao: 'Mês não liberado para agendamentos'
              };
            }
            return dia;
          });
        }
      }
    },
    updateDayConfig: (state, action) => {
      const { configKey, config } = action.payload;
      state.dayConfigs[configKey] = config;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgendaData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgendaData.fulfilled, (state, action) => {
        state.loading = false;
        const { mesAno, agendaData } = action.payload;
        
        if (agendaData && typeof agendaData === 'object' && typeof agendaData.then !== 'function') {
          state.agendas[mesAno] = agendaData;
          state.currentMesAno = mesAno;
        } else {
          state.error = 'Dados inválidos retornados da agenda';
          console.error('❌ Dados inválidos no Redux:', agendaData);
        }
      })
      .addCase(fetchAgendaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao carregar agenda';
        
        const mesAno = state.currentMesAno;
        if (!state.agendas[mesAno]) {
          state.agendas[mesAno] = {
            dias: [],
            meta: {
              mes: parseInt(mesAno.split('-')[0]),
              ano: parseInt(mesAno.split('-')[1]),
              nomeMes: 'Mês',
              diasNoMes: 0,
              mesAno: mesAno,
              disponivel: false
            }
          };
        }
      });
  }
});

export const { 
  setCurrentMesAno, 
  updateDay,
  setMesDisponivel,
  updateDayConfig,
  clearError
} = agendaSlice.actions;

// ✅ SELECTORS SIMPLES - SEM MEMOIZAÇÃO COMPLEXA
export const selectCurrentAgenda = (state) => 
  state.agenda.agendas[state.agenda.currentMesAno] || { dias: [], meta: {} };

export const selectCurrentMesAno = (state) => state.agenda.currentMesAno;
export const selectAgendaLoading = (state) => state.agenda.loading || false;
export const selectAgendaError = (state) => state.agenda.error || null;

export const selectMesDisponivel = (mesAno) => (state) => 
  state.agenda.agendas[mesAno]?.meta?.disponivel || false;

export const selectDayConfigs = (state) => state.agenda.dayConfigs || {};

export default agendaSlice.reducer;