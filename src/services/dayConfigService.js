// 🆕 ATUALIZAÇÃO: src/services/dayConfigService.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export class DayConfigService {
  static async loadDayConfig(mesAno, dia) {
    try {
      console.log('🔍 Buscando configuração para:', { mesAno, dia });
      
      // 1. Primeiro tenta carregar do Firebase
      const configId = `${mesAno}-${dia}`;
      const docRef = doc(db, 'dayConfigs', configId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const config = docSnap.data();
        console.log('✅ Configuração encontrada no Firebase:', configId, config);
        return config;
      }
      
      console.log('❌ Configuração não encontrada no Firebase:', configId);
      
      // 2. Fallback: verificar se existe em dayConfigs carregados pelo initialData
      const initialDataKey = `dayConfigs_${mesAno}`;
      const initialData = localStorage.getItem(initialDataKey);
      
      if (initialData) {
        const allConfigs = JSON.parse(initialData);
        const config = allConfigs.find(c => c.dia === dia);
        if (config) {
          console.log('✅ Configuração encontrada no initialData:', config);
          return config;
        }
      }
      
      // 3. Fallback final: localStorage individual
      const localKey = `dayConfig-${mesAno}-${dia}`;
      const localData = localStorage.getItem(localKey);
      
      if (localData) {
        console.log('✅ Configuração encontrada no localStorage:', localKey);
        return JSON.parse(localData);
      }
      
      console.log('❌ Nenhuma configuração encontrada para:', { mesAno, dia });
      return null;
      
    } catch (error) {
      console.error('❌ Erro ao carregar configuração do dia:', error);
      return null;
    }
  }

  static async getAvailableHorarios(mesAno, dia) {
    try {
      const config = await this.loadDayConfig(mesAno, dia);
      
      if (!config) {
        console.log('📭 Sem configuração - retornando array vazio');
        return [];
      }
      
      console.log('⚙️ Configuração carregada:', config);
      
      // Se não tem horários customizados, retorna vazio
      if (!config.horarios || Object.keys(config.horarios).length === 0) {
        console.log('⏰ Sem horários customizados na configuração');
        return [];
      }
      
      // Filtra apenas horários disponíveis
      const availableHorarios = Object.entries(config.horarios)
        .filter(([horario, configHorario]) => {
          const isAvailable = configHorario.status === 'disponivel' && 
                            configHorario.disponivel !== false;
          console.log(`⏰ Horário ${horario}: ${isAvailable ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`, configHorario);
          return isAvailable;
        })
        .map(([horario]) => horario)
        .sort();
      
      console.log('🕐 Horários disponíveis encontrados:', availableHorarios);
      return availableHorarios;
      
    } catch (error) {
      console.error('❌ Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }
}