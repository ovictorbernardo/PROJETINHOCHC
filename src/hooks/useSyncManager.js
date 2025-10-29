// src/hooks/useSyncManager.js
import { useEffect, useState } from 'react';
import { BookingService } from '../services/bookingService';
import { useAgenda } from './useAgenda';

export const useSyncManager = (mesAno, selectedDate) => {
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(null);
  const { refreshAgenda } = useAgenda();

  // 🎯 OUVIR MUDANÇAS EM TEMPO REAL PARA CONFIGURAÇÕES DO DIA
  useEffect(() => {
    if (!selectedDate || !mesAno) return;

    const dayNumber = selectedDate.getDate();
    
    const unsubscribe = BookingService.subscribeToDayConfigChanges(
      mesAno, 
      dayNumber, 
      (updatedConfig) => {
        setSyncStatus('updated');
        setLastSync(new Date());
        
        // 🎯 ATUALIZAR AGENDA E DISPARAR EVENTO
        refreshAgenda();
        
        window.dispatchEvent(new CustomEvent('dayConfigUpdated', {
          detail: { mesAno, dayNumber, config: updatedConfig }
        }));
      }
    );

    return () => unsubscribe();
  }, [mesAno, selectedDate, refreshAgenda]);

  // 🎯 OUVIR MUDANÇAS GLOBAIS NA CONFIGURAÇÃO DO CALENDÁRIO
  useEffect(() => {
    const unsubscribe = BookingService.subscribeToCalendarSettings((settings) => {
      setSyncStatus('updated');
      setLastSync(new Date());
      
      // 🎯 ATUALIZAR CONFIGURAÇÕES GLOBAIS
      window.dispatchEvent(new CustomEvent('calendarSettingsUpdated', {
        detail: { settings }
      }));
    });

    return () => unsubscribe();
  }, []);

  return {
    syncStatus,
    lastSync,
    isSyncing: syncStatus === 'syncing'
  };
};