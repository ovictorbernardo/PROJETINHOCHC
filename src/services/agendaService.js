// src/services/agendaService.js
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export class AgendaService {
  // ✅ SALVAR agenda no Firebase
  static async saveAgenda(mesAno, agendaData) {
    try {
      const agendaRef = doc(db, 'agendas', mesAno);
      await setDoc(agendaRef, {
        ...agendaData,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao salvar agenda:', error);
      throw error;
    }
  }

  // ✅ CARREGAR agenda do Firebase
  static async loadAgenda(mesAno) {
    try {
      const agendaRef = doc(db, 'agendas', mesAno);
      const agendaSnap = await getDoc(agendaRef);
      
      if (agendaSnap.exists()) {
        return agendaSnap.data();
      }
      return null; // Retorna null se não existir
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      throw error;
    }
  }

  // ✅ OUVIR mudanças em tempo real
  static subscribeToAgenda(mesAno, callback) {
    const agendaRef = doc(db, 'agendas', mesAno);
    
    return onSnapshot(agendaRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    });
  }

  // ✅ ATUALIZAR status do mês
  static async updateMesStatus(mesAno, disponivel) {
    try {
      const agendaRef = doc(db, 'agendas', mesAno);
      await updateDoc(agendaRef, {
        'meta.disponivel': disponivel,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do mês:', error);
      throw error;
    }
  }
}