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
    const loadAgenda = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Tenta carregar do Firebase
        const firebaseAgenda = await AgendaService.loadAgenda(mesAno);
        
        if (firebaseAgenda) {
          setAgenda(firebaseAgenda);
          setUsingFirebase(true);
        } else {
          // 2. Fallback para dados locais
          const localAgenda = getAgendaByMesAno(mesAno);
          setAgenda(localAgenda);
          setUsingFirebase(false);
        }
      } catch (err) {
        console.error('Erro ao carregar agenda:', err);
        setError('Erro ao carregar agenda');
        // Fallback para dados locais em caso de erro
        const localAgenda = getAgendaByMesAno(mesAno);
        setAgenda(localAgenda);
        setUsingFirebase(false);
      } finally {
        setLoading(false);
      }
    };

    loadAgenda();

    // 3. Escuta mudanças em tempo real
    const unsubscribe = AgendaService.subscribeToAgenda(mesAno, (agendaData) => {
      if (agendaData) {
        setAgenda(agendaData);
        setUsingFirebase(true);
      }
    });

    return () => unsubscribe();
  }, [mesAno]);

  const saveAgenda = async (agendaData) => {
    try {
      setError(null);
      await AgendaService.saveAgenda(mesAno, agendaData);
      setAgenda(agendaData);
      setUsingFirebase(true);
      return true;
    } catch (err) {
      console.error('Erro ao salvar agenda:', err);
      setError('Erro ao salvar agenda');
      return false;
    }
  };

  const updateMesStatus = async (disponivel) => {
    try {
      setError(null);
      await AgendaService.updateMesStatus(mesAno, disponivel);
      
      // Atualiza estado local
      const updatedAgenda = {
        ...agenda,
        meta: { ...agenda.meta, disponivel }
      };
      setAgenda(updatedAgenda);
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status do mês');
      return false;
    }
  };

  return {
    agenda,
    loading,
    error,
    usingFirebase,
    saveAgenda,
    updateMesStatus,
    refetch: () => {
      setLoading(true);
      // Recarregar dados
    }
  };
};