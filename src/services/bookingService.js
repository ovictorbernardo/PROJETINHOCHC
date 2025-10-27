// src/services/bookingService.js
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc 
} from 'firebase/firestore';

export class BookingService {
  // ✅ CRIAR novo agendamento
  static async createBooking(bookingData) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, {
        data: bookingData.data,
        adultos: bookingData.adultos,
        criancas: bookingData.criancas,
        informacoesAdicionais: bookingData.informacoesAdicionais,
        totalPessoas: bookingData.totalPessoas,
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...bookingData };
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      throw error;
    }
  }

  // ✅ CARREGAR agendamentos por mês
  static async loadBookingsByMes(mesAno) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('data.mesAno', '==', mesAno));
      const querySnapshot = await getDocs(q);
      const bookings = [];
      querySnapshot.forEach((doc) => bookings.push({ id: doc.id, ...doc.data() }));
      return bookings;
    } catch (error) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      throw error;
    }
  }

  // ✅ OUVIR agendamentos em tempo real
  static subscribeToBookings(mesAno, callback) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('data.mesAno', '==', mesAno));
    return onSnapshot(q, (snapshot) => {
      const bookings = [];
      snapshot.forEach((doc) => bookings.push({ id: doc.id, ...doc.data() }));
      callback(bookings);
    });
  }

  // ✅ ATUALIZAR status do agendamento
  static async updateBookingStatus(bookingId, status) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar agendamento:', error);
      throw error;
    }
  }

  // ✅ BUSCAR todos os agendamentos
  static async loadAllBookings() {
    try {
      const bookingsRef = collection(db, 'bookings');
      const querySnapshot = await getDocs(bookingsRef);
      const bookings = [];
      querySnapshot.forEach((doc) => bookings.push({ id: doc.id, ...doc.data() }));
      return bookings;
    } catch (error) {
      console.error('❌ Erro ao carregar todos os agendamentos:', error);
      throw error;
    }
  }

  // ✅ VERIFICAR DISPONIBILIDADE
  static async checkAvailability(dateString, time) {
    try {
      const [dia, mesAno] = dateString.split('/');
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('data.mesAno', '==', mesAno),
        where('data.dia', '==', parseInt(dia)),
        where('data.horario', '==', time),
        where('status', 'in', ['pendente', 'confirmado'])
      );

      const querySnapshot = await getDocs(q);
      let totalPessoas = 0;
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const adultos = booking.adultos?.length || 0;
        const criancas = booking.criancas?.length || 0;
        totalPessoas += adultos + criancas;
      });

      const maxLimit = 30;
      return {
        available: totalPessoas < maxLimit,
        currentCount: totalPessoas,
        maxLimit,
        remaining: maxLimit - totalPessoas
      };
    } catch (error) {
      console.error('❌ Erro ao verificar disponibilidade:', error);
      return { available: true, currentCount: 0, maxLimit: 30, remaining: 30, error: true };
    }
  }

  // ✅ VERIFICAR CPF DUPLICADO
  static async checkDuplicateCPF(cpf, dateString) {
    try {
      const [dia, mesAno] = dateString.split('/');
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('data.mesAno', '==', mesAno),
        where('data.dia', '==', parseInt(dia)),
        where('status', 'in', ['pendente', 'confirmado'])
      );
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const booking = doc.data();
        const hasDuplicate = booking.adultos?.some(adulto => adulto.cpf === cpf);
        if (hasDuplicate) return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao verificar CPF duplicado:', error);
      return false;
    }
  }
}

/* ============================================================
   🆕 NOVAS FUNÇÕES DE CONFIGURAÇÃO DE DIAS (Firebase + LocalStorage)
   ============================================================ */

const saveToLocalStorage = (mesAno, day, config) => {
  const key = `dayConfig-${mesAno}-${day}`;
  localStorage.setItem(key, JSON.stringify(config));
  console.warn('⚠️ Configuração salva localmente (fallback).');
};

export const saveDayConfigToFirebase = async (mesAno, day, config) => {
  try {
    const docRef = doc(db, 'dayConfigs', `${mesAno}-${day}`);
    await setDoc(docRef, {
      ...config,
      mesAno,
      day,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('✅ Configuração salva no Firebase:', `${mesAno}-${day}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar no Firebase:', error);
    saveToLocalStorage(mesAno, day, config);
    return false;
  }
};

export const loadDayConfigFromFirebase = async (mesAno, day) => {
  try {
    const docRef = doc(db, 'dayConfigs', `${mesAno}-${day}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    console.log('⚠️ Nenhuma configuração encontrada para', `${mesAno}-${day}`);
    return null;
  } catch (error) {
    console.error('❌ Erro ao carregar do Firebase:', error);
    return null;
  }
};

// ✅ EXPORT FUNÇÕES INDIVIDUAIS PARA COMPATIBILIDADE ANTIGA
export const checkAvailability = BookingService.checkAvailability;
export const checkDuplicateCPF = BookingService.checkDuplicateCPF;

export default BookingService;
