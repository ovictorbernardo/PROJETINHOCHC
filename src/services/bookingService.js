// src/services/bookingService.js - ATUALIZADO E INTEGRADO
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
      const diaNumero = parseInt(dia);
      
      console.log('🔍 Verificando disponibilidade:', { dateString, time, diaNumero, mesAno });

      const dayConfig = await loadDayConfigFromFirebase(mesAno, diaNumero);
      
      if (dayConfig && dayConfig.horarios && dayConfig.horarios[time]) {
        const horarioConfig = dayConfig.horarios[time];
        
        if (['fechado', 'indisponivel', 'lotado'].includes(horarioConfig.status)) {
          return {
            available: false,
            currentCount: horarioConfig.lotacaoAtual || 0,
            maxLimit: horarioConfig.lotacaoMaxima || 30,
            remaining: 0,
            reason: 'Horário bloqueado ou lotado'
          };
        }

        const maxLimit = horarioConfig.lotacaoMaxima || 30;
        const currentFromConfig = horarioConfig.lotacaoAtual || 0;
        const realBookingsCount = await this.countRealBookingsForTimeSlot(mesAno, diaNumero, time);
        const currentCount = Math.max(currentFromConfig, realBookingsCount);
        const remaining = maxLimit - currentCount;
        const available = remaining > 0 && horarioConfig.status === 'disponivel';

        return { available, currentCount, maxLimit, remaining, reason: available ? 'Disponível' : 'Lotado' };
      }

      const realBookingsCount = await this.countRealBookingsForTimeSlot(mesAno, diaNumero, time);
      const maxLimit = 30;

      return {
        available: realBookingsCount < maxLimit,
        currentCount: realBookingsCount,
        maxLimit,
        remaining: maxLimit - realBookingsCount,
        reason: realBookingsCount < maxLimit ? 'Disponível' : 'Lotado'
      };

    } catch (error) {
      console.error('❌ Erro ao verificar disponibilidade:', error);
      return { available: true, currentCount: 0, maxLimit: 30, remaining: 30, reason: 'Erro na verificação', error: true };
    }
  }

  // 🆕 CONTAR AGENDAMENTOS REAIS PARA UM HORÁRIO
  static async countRealBookingsForTimeSlot(mesAno, diaNumero, time) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('data.mesAno', '==', mesAno),
        where('data.dia', '==', diaNumero),
        where('data.horario', '==', time),
        where('status', 'in', ['pendente', 'confirmado'])
      );
      const querySnapshot = await getDocs(q);
      let totalPessoas = 0;
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        totalPessoas += (booking.adultos?.length || 0) + (booking.criancas?.length || 0);
      });
      return totalPessoas;
    } catch (error) {
      console.error('❌ Erro ao contar agendamentos reais:', error);
      return 0;
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
        if (booking.adultos?.some(a => a.cpf === cpf)) return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao verificar CPF duplicado:', error);
      return false;
    }
  }

  // ✅ OUVIR MUDANÇAS NAS CONFIGURAÇÕES DO DIA (DAYCONFIG)
  static subscribeToDayConfigChanges(mesAno, dayNumber, callback) {
    const configDocRef = doc(db, 'dayConfigs', `${mesAno}-${dayNumber}`);
    return onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) callback(docSnap.data());
      else callback(null);
    });
  }

  /* ============================================================
     🆕 FUNÇÕES ADICIONADAS (DINÂMICAS E GLOBAIS)
     ============================================================ */

  // 🎯 OBTER CONFIGURAÇÃO DO DIA COM LIMITES DINÂMICOS
  static async getDayConfig(mesAno, dia) {
    try {
      const docRef = doc(db, 'agenda', mesAno, 'dias', dia.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return {
        horarios: {
          '10:00': { disponivel: true, maxPessoas: 30 },
          '14:00': { disponivel: true, maxPessoas: 30 },
          '16:00': { disponivel: true, maxPessoas: 30 }
        },
        maxAdultos: 5,
        maxCriancas: 20,
        disponivel: true
      };
    } catch (error) {
      console.error('❌ Erro ao obter configuração do dia:', error);
      throw error;
    }
  }

  // 🎯 OUVIR MUDANÇAS NA CONFIGURAÇÃO DO DIA (NOVA ESTRUTURA)
  static subscribeToDynamicDayConfig(mesAno, dia, callback) {
    const docRef = doc(db, 'agenda', mesAno, 'dias', dia.toString());
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) callback(docSnap.data());
    });
  }

  // 🎯 OUVIR MUDANÇAS NAS CONFIGURAÇÕES GLOBAIS
  static subscribeToCalendarSettings(callback) {
    const docRef = doc(db, 'config', 'calendar');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) callback(docSnap.data());
    });
  }

  // 🎯 OBTER LIMITES GLOBAIS
  static async getGlobalLimits() {
    try {
      const docRef = doc(db, 'config', 'calendar');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          maxAdultos: data.maxAdultos || 5,
          maxCriancas: data.maxCriancas || 20,
          maxPessoasPorHorario: data.maxPessoasPorHorario || 30
        };
      }
      return { maxAdultos: 5, maxCriancas: 20, maxPessoasPorHorario: 30 };
    } catch (error) {
      console.error('❌ Erro ao obter limites globais:', error);
      return { maxAdultos: 5, maxCriancas: 20, maxPessoasPorHorario: 30 };
    }
  }
}

/* ============================================================
   🔧 FUNÇÕES DE SUPORTE (Firebase + LocalStorage)
   ============================================================ */

const saveToLocalStorage = (mesAno, day, config) => {
  const key = `dayConfig-${mesAno}-${day}`;
  localStorage.setItem(key, JSON.stringify(config));
  console.warn('⚠️ Configuração salva localmente (fallback):', key);
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
    console.log('✅ Configuração salva no Firebase:', `${mesAno}-${day}`, config);
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
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error('❌ Erro ao carregar do Firebase:', error);
    const key = `dayConfig-${mesAno}-${day}`;
    const localData = localStorage.getItem(key);
    return localData ? JSON.parse(localData) : null;
  }
};

// ✅ EXPORTS ANTIGOS PARA COMPATIBILIDADE
export const checkAvailability = BookingService.checkAvailability;
export const checkDuplicateCPF = BookingService.checkDuplicateCPF;

export default BookingService;
