import { useState, useEffect } from 'react';
import { AgendaService } from '../services/agendaService';
import { getAgendaByMesAno } from '../utils/initialData';

export const useAgenda = (mesAno) => {
  const [agenda, setAgenda] = useState(() => getAgendaByMesAno(mesAno));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingLocalData, setUsingLocalData] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    const loadAgenda = async () => {
      try {
        setLoading(true);
        
        await new Promise((resolve, reject) => {
          const unsubscribe = AgendaService.subscribeToAgenda(
            mesAno,
            (firebaseData) => {
              if (firebaseData.dias && firebaseData.dias.length > 0) {
                setAgenda(firebaseData);
                setUsingLocalData(false);
                setFirebaseConnected(true);
              } else {
                // Se Firebase vazio, usa dados locais para o mês específico
                setAgenda(getAgendaByMesAno(mesAno));
                setUsingLocalData(true);
                setFirebaseConnected(true);
                
                // Sincroniza dados locais com Firebase
                AgendaService.saveAgenda(mesAno, getAgendaByMesAno(mesAno))
                  .catch(err => console.log('❌ Falha na sincronização:', err));
              }
              unsubscribe();
              resolve();
            },
            (firebaseError) => {
              // Firebase offline - usa dados locais para o mês
              setAgenda(getAgendaByMesAno(mesAno));
              setUsingLocalData(true);
              setFirebaseConnected(false);
              setError('Firebase offline - Modo local ativo');
              unsubscribe();
              resolve();
            }
          );
        });
        
      } catch (err) {
        setAgenda(getAgendaByMesAno(mesAno));
        setUsingLocalData(true);
        setFirebaseConnected(false);
        setError('Sistema offline - Modo local');
      } finally {
        setLoading(false);
      }
    };

    loadAgenda();
  }, [mesAno]); // ✅ Re-executa quando mesAno muda

  const saveAgenda = async (dadosAgenda) => {
    try {
      await AgendaService.saveAgenda(mesAno, dadosAgenda);
      setAgenda(dadosAgenda);
      setUsingLocalData(false);
      setFirebaseConnected(true);
      setError(null);
      return true;
    } catch (err) {
      setAgenda(dadosAgenda);
      setUsingLocalData(true);
      setFirebaseConnected(false);
      setError('Firebase offline - Dados salvos localmente');
      return true;
    }
  };

  return { 
    agenda, 
    loading, 
    error, 
    saveAgenda,
    usingLocalData,
    firebaseConnected
  };
};