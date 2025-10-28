// src/core/managers/CalendarSyncManager.js
import { useDispatch, useSelector } from 'react-redux';
import { updateDay } from '../../store/slices/agendaSlice';
import { AgendaService } from '../../services/agendaService'; // ✅ IMPORT CORRETO

/**
 * Manager SOLID para sincronizar calendários do admin
 */
export const useCalendarSyncManager = () => {
  const dispatch = useDispatch();
  const currentMesAno = useSelector(state => state.agenda.currentMesAno);
  const agenda = useSelector(state => state.agenda.agendas[currentMesAno]);

  /**
   * Atualiza um dia e sincroniza entre todos os calendários
   */
  const updateDayAndSync = async (diaIndex, updates) => {
    try {
      console.log('🔄 Sincronizando dia:', diaIndex, updates);
      
      // 1. Atualiza no Redux (atualiza UI imediatamente)
      dispatch(updateDay({
        mesAno: currentMesAno,
        diaIndex,
        updates
      }));

      // 2. Atualiza no Firebase (persistência)
      if (agenda && agenda.dias) {
        const diasAtualizados = [...agenda.dias];
        diasAtualizados[diaIndex] = {
          ...diasAtualizados[diaIndex],
          ...updates
        };

        // ✅ CORREÇÃO: Usar a classe AgendaService corretamente
        await AgendaService.saveAgenda(currentMesAno, {
          ...agenda,
          dias: diasAtualizados,
          lastUpdated: new Date().toISOString()
        });
      }

      console.log('✅ Dia sincronizado com sucesso');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erro ao sincronizar dia:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Marcar dia como ocupado
   */
  const markDayAsOccupied = async (diaIndex) => {
    return await updateDayAndSync(diaIndex, {
      status: 'ocupado',
      disponivel: false,
      observacao: 'Dia marcado como ocupado pelo admin'
    });
  };

  /**
   * Marcar dia como disponível  
   */
  const markDayAsAvailable = async (diaIndex) => {
    return await updateDayAndSync(diaIndex, {
      status: 'disponivel', 
      disponivel: true,
      observacao: ''
    });
  };

  /**
   * Atualizar horário específico
   */
  const updateHorario = async (diaIndex, horarioKey, horarioUpdates) => {
    const dia = agenda.dias[diaIndex];
    const horariosAtualizados = {
      ...dia.horarios,
      [horarioKey]: {
        ...dia.horarios[horarioKey],
        ...horarioUpdates
      }
    };

    return await updateDayAndSync(diaIndex, {
      horarios: horariosAtualizados
    });
  };

  return {
    updateDayAndSync,
    markDayAsOccupied,
    markDayAsAvailable, 
    updateHorario
  };
};