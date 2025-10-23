import { db } from './firebase.js';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

export class AgendaService {
  static subscribeToAgenda(mesAno, onSuccess, onError) {
    try {
      // Verifica se Firebase está inicializado
      if (!db) {
        throw new Error('Firebase não inicializado');
      }

      const agendaRef = doc(db, 'public/data/agenda', mesAno);
      
      console.log('📡 Conectando ao Firebase...');
      
      const unsubscribe = onSnapshot(
        agendaRef,
        (snapshot) => {
          console.log('📨 Resposta do Firebase recebida');
          if (snapshot.exists()) {
            const data = snapshot.data();
            console.log('✅ Dados encontrados no Firebase:', data.dias?.length, 'dias');
            onSuccess(data);
          } else {
            console.log('ℹ️  Nenhum dado encontrado no Firebase');
            onSuccess({ dias: [] });
          }
        },
        (error) => {
          console.error('❌ Erro na conexão Firebase:', error);
          if (onError) {
            onError(error);
          } else {
            // Fallback silencioso
            onSuccess({ dias: [] });
          }
        }
      );

      return unsubscribe;

    } catch (error) {
      console.error('❌ Erro crítico Firebase:', error);
      if (onError) {
        onError(error);
      }
      // Retorna função vazia para unsubscribe
      return () => {};
    }
  }

  static async saveAgenda(mesAno, dadosAgenda) {
    try {
      if (!db) {
        throw new Error('Firebase não inicializado');
      }

      const agendaRef = doc(db, 'public/data/agenda', mesAno);
      console.log('💾 Salvando no Firebase...', dadosAgenda.dias?.length, 'dias');
      
      await setDoc(agendaRef, dadosAgenda, { merge: true });
      
      console.log('✅ Dados salvos com sucesso no Firebase');
      return true;

    } catch (error) {
      console.error('❌ Erro ao salvar no Firebase:', error);
      throw error;
    }
  }

  // Novo método: Verifica conexão com Firebase
  static async testConnection() {
    try {
      if (!db) {
        return { connected: false, error: 'Firebase não inicializado' };
      }

      const testRef = doc(db, 'public/test/connection');
      await getDoc(testRef);
      
      return { connected: true };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}