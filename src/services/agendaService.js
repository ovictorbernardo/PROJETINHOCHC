// src/services/agendaService.js
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export class AgendaService {
  // ✅ SALVAR agenda no Firebase
  static async saveAgenda(mesAno, agendaData) {
    try {
      // 🎯 VALIDAR PARÂMETROS
      if (!mesAno || typeof mesAno !== 'string') {
        throw new Error('mesAno é obrigatório e deve ser uma string');
      }
      
      if (!agendaData || !agendaData.dias) {
        throw new Error('agendaData é obrigatório e deve conter dias');
      }

      console.log('💾 Salvando agenda no Firebase:', mesAno);
      
      const agendaRef = doc(db, 'agendas', mesAno);
      await setDoc(agendaRef, {
        ...agendaData,
        lastUpdated: new Date().toISOString(),
        sincronizado: true
      });
      
      console.log('✅ Agenda salva com sucesso no Firebase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar agenda:', error);
      throw error;
    }
  }

  // ✅ CARREGAR agenda do Firebase
  static async loadAgenda(mesAno) {
    try {
      // 🎯 VALIDAR mesAno
      if (!mesAno || typeof mesAno !== 'string') {
        console.warn('⚠️ mesAno inválido:', mesAno);
        return null;
      }

      console.log('📥 Carregando agenda do Firebase:', mesAno);
      
      const agendaRef = doc(db, 'agendas', mesAno);
      const agendaSnap = await getDoc(agendaRef);
      
      if (agendaSnap.exists()) {
        const data = agendaSnap.data();
        console.log('✅ Agenda encontrada no Firebase');
        return data;
      }
      
      console.log('📭 Agenda não encontrada no Firebase');
      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar agenda:', error);
      throw error;
    }
  }

  // ✅ OUVIR mudanças em tempo real
  static subscribeToAgenda(mesAno, callback) {
    try {
      // 🎯 VALIDAR PARÂMETROS
      if (!mesAno || typeof mesAno !== 'string') {
        console.warn('⚠️ mesAno inválido para subscription:', mesAno);
        return () => {}; // Retorna função vazia
      }

      if (typeof callback !== 'function') {
        console.warn('⚠️ Callback inválido para subscription');
        return () => {};
      }

      console.log('🎯 Iniciando subscription para:', mesAno);
      
      const agendaRef = doc(db, 'agendas', mesAno);
      
      const unsubscribe = onSnapshot(
        agendaRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            console.log('🔄 Recebida atualização em tempo real');
            callback(snapshot.data());
          } else {
            console.log('📭 Documento não existe na subscription');
            callback(null);
          }
        },
        (error) => {
          console.error('❌ Erro na subscription:', error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('❌ Erro ao criar subscription:', error);
      return () => {}; // Retorna função vazia em caso de erro
    }
  }

  // ✅ ATUALIZAR status do mês
  static async updateMesStatus(mesAno, disponivel) {
    try {
      // 🎯 VALIDAR PARÂMETROS
      if (!mesAno || typeof mesAno !== 'string') {
        throw new Error('mesAno é obrigatório');
      }

      console.log('🔄 Atualizando status do mês:', { mesAno, disponivel });
      
      const agendaRef = doc(db, 'agendas', mesAno);
      
      // 🎯 PRIMEIRO VERIFICAR SE O DOCUMENTO EXISTE
      const agendaSnap = await getDoc(agendaRef);
      
      if (!agendaSnap.exists()) {
        console.warn('⚠️ Agenda não existe, criando documento...');
        // Criar documento básico se não existir
        await setDoc(agendaRef, {
          meta: { disponivel },
          lastUpdated: new Date().toISOString()
        });
      } else {
        // Atualizar documento existente
        await updateDoc(agendaRef, {
          'meta.disponivel': disponivel,
          lastUpdated: new Date().toISOString()
        });
      }
      
      console.log('✅ Status do mês atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status do mês:', error);
      throw error;
    }
  }

  // ✅ VERIFICAR SE AGENDA EXISTE
  static async agendaExists(mesAno) {
    try {
      if (!mesAno) return false;
      
      const agendaRef = doc(db, 'agendas', mesAno);
      const agendaSnap = await getDoc(agendaRef);
      return agendaSnap.exists();
    } catch (error) {
      console.error('❌ Erro ao verificar existência da agenda:', error);
      return false;
    }
  }

  // ✅ OBTER TODAS AS AGENDAS
  static async getAllAgendas() {
    try {
      const agendasRef = collection(db, 'agendas');
      const querySnapshot = await getDocs(agendasRef);
      
      const agendas = {};
      querySnapshot.forEach((doc) => {
        agendas[doc.id] = doc.data();
      });
      
      return agendas;
    } catch (error) {
      console.error('❌ Erro ao obter todas as agendas:', error);
      throw error;
    }
  }
}