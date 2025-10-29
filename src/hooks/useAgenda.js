// src/hooks/useAgenda.js
import { useState, useEffect } from 'react';
import { AgendaService } from '../services/agendaService';
import { getAgendaByMesAno, generateAgendaLiberada } from '../utils/initialData';

export const useAgenda = (mesAno) => {
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFirebase, setUsingFirebase] = useState(false);

  useEffect(() => {
    // 🎯 VALIDAR mesAno ANTES DE TUDO
    if (!mesAno || typeof mesAno !== 'string') {
      console.warn('⚠️ mesAno não definido ou inválido:', mesAno);
      setError('Parâmetro mesAno é obrigatório');
      setLoading(false);
      return;
    }

    const loadAgenda = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Carregando agenda para:', mesAno);
        
        // 1. Tenta carregar do Firebase primeiro
        let firebaseAgenda = null;
        try {
          firebaseAgenda = await AgendaService.loadAgenda(mesAno);
          console.log('📥 Resposta do Firebase:', firebaseAgenda);
        } catch (firebaseError) {
          console.warn('⚠️ Erro ao carregar do Firebase, usando fallback:', firebaseError);
        }

        if (firebaseAgenda && firebaseAgenda.dias) {
          console.log('✅ Agenda carregada do Firebase');
          setAgenda(firebaseAgenda);
          setUsingFirebase(true);
        } else {
          // 2. Fallback para dados locais
          console.log('📝 Usando fallback para dados locais');
          const localAgenda = await getAgendaByMesAno(mesAno);
          setAgenda(localAgenda);
          setUsingFirebase(false);
          
          // 🎯 SALVAR NO FIREBASE PARA PRÓXIMA VEZ
          try {
            await AgendaService.saveAgenda(mesAno, localAgenda);
            console.log('💾 Agenda padrão salva no Firebase');
          } catch (saveError) {
            console.warn('⚠️ Não foi possível salvar agenda padrão no Firebase:', saveError);
          }
        }
      } catch (err) {
        console.error('❌ Erro crítico ao carregar agenda:', err);
        setError('Erro ao carregar agenda');
        
        // 🎯 FALLBACK FINAL: Gerar agenda liberada
        try {
          const fallbackAgenda = generateAgendaLiberada(mesAno);
          setAgenda(fallbackAgenda);
          setUsingFirebase(false);
        } catch (fallbackError) {
          console.error('❌ Erro no fallback final:', fallbackError);
          setAgenda({ dias: [], meta: {} });
        }
      } finally {
        setLoading(false);
      }
    };

    loadAgenda();

    // 3. Escuta mudanças em tempo real (apenas se Firebase estiver funcionando)
    let unsubscribe = () => {};
    try {
      unsubscribe = AgendaService.subscribeToAgenda(mesAno, (agendaData) => {
        if (agendaData && agendaData.dias) {
          console.log('🔄 Agenda atualizada em tempo real');
          setAgenda(agendaData);
          setUsingFirebase(true);
        }
      });
    } catch (subscribeError) {
      console.warn('⚠️ Não foi possível criar subscription:', subscribeError);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [mesAno]);

  const saveAgenda = async (agendaData) => {
    try {
      setError(null);
      console.log('💾 Salvando agenda...');
      
      const success = await AgendaService.saveAgenda(mesAno, agendaData);
      
      if (success) {
        setAgenda(agendaData);
        setUsingFirebase(true);
        console.log('✅ Agenda salva com sucesso');
        return true;
      } else {
        throw new Error('Falha ao salvar agenda');
      }
    } catch (err) {
      console.error('❌ Erro ao salvar agenda:', err);
      setError('Erro ao salvar agenda');
      return false;
    }
  };

  const updateMesStatus = async (disponivel) => {
    try {
      setError(null);
      
      if (!agenda) {
        throw new Error('Agenda não carregada');
      }

      const success = await AgendaService.updateMesStatus(mesAno, disponivel);
      
      if (success) {
        // Atualiza estado local
        const updatedAgenda = {
          ...agenda,
          meta: { 
            ...agenda.meta, 
            disponivel 
          }
        };
        setAgenda(updatedAgenda);
        console.log('✅ Status do mês atualizado:', disponivel);
        return true;
      } else {
        throw new Error('Falha ao atualizar status');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar status:', err);
      setError('Erro ao atualizar status do mês');
      return false;
    }
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const firebaseAgenda = await AgendaService.loadAgenda(mesAno);
      if (firebaseAgenda && firebaseAgenda.dias) {
        setAgenda(firebaseAgenda);
        setUsingFirebase(true);
      }
    } catch (err) {
      console.error('❌ Erro ao recarregar agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    agenda,
    loading,
    error,
    usingFirebase,
    saveAgenda,
    updateMesStatus,
    refetch
  };
};