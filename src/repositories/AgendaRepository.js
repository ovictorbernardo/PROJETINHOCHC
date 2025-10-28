// src/repositories/AgendaRepository.js
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export class AgendaRepository {
  static async getMonthData(mesAno) {
    try {
      const docRef = doc(db, 'public', 'data', 'agenda', mesAno);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados da agenda:', error);
      throw error;
    }
  }

  static async updateMonthData(mesAno, data) {
    try {
      const docRef = doc(db, 'public', 'data', 'agenda', mesAno);
      await setDoc(docRef, data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar dados da agenda:', error);
      throw error;
    }
  }
}

export default AgendaRepository;
