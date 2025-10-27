// src/hooks/useDayConfigs.js
import { useState, useEffect } from 'react';
import BookingService from '../services/bookingService';

export const useDayConfigs = (mesAno) => {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar configurações iniciais
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        const monthConfigs = await BookingService.loadMonthConfigs(mesAno);
        setConfigs(monthConfigs);
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    if (mesAno) {
      loadConfigs();
    }
  }, [mesAno]);

  // Ouvir mudanças em tempo real
  useEffect(() => {
    if (!mesAno) return;

    const unsubscribe = BookingService.subscribeToMonthConfigs(mesAno, (newConfigs) => {
      setConfigs(newConfigs);
    });

    return unsubscribe;
  }, [mesAno]);

  // Função para atualizar configuração de um dia
  const updateDayConfig = async (dia, config) => {
    try {
      setError(null);
      await BookingService.saveDayConfig(mesAno, dia, config);
      
      // Atualizar estado local imediatamente
      setConfigs(prev => ({
        ...prev,
        [dia]: { ...config, mesAno, dia }
      }));
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar configuração:', err);
      setError('Erro ao salvar configuração');
      return false;
    }
  };

  return {
    configs,
    loading,
    error,
    updateDayConfig
  };
};