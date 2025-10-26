// src/services/bookingService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export class BookingService {
  // ✅ CRIAR novo agendamento (ESTRUTURA NOVA)
  static async createBooking(bookingData) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, {
        // 🆕 ESTRUTURA NOVA
        data: bookingData.data,
        adultos: bookingData.adultos,
        criancas: bookingData.criancas,
        informacoesAdicionais: bookingData.informacoesAdicionais,
        totalPessoas: bookingData.totalPessoas,
        
        // Metadados
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { id: docRef.id, ...bookingData };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
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
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      
      return bookings;
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      throw error;
    }
  }

  // ✅ OUVIR agendamentos em tempo real
  static subscribeToBookings(mesAno, callback) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('data.mesAno', '==', mesAno));
    
    return onSnapshot(q, (snapshot) => {
      const bookings = [];
      snapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
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
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  }

  // ✅ BUSCAR todos os agendamentos
  static async loadAllBookings() {
    try {
      const bookingsRef = collection(db, 'bookings');
      const querySnapshot = await getDocs(bookingsRef);
      
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      
      return bookings;
    } catch (error) {
      console.error('Erro ao carregar todos os agendamentos:', error);
      throw error;
    }
  }

  // ✅ VERIFICAR DISPONIBILIDADE (NOVA FUNÇÃO)
  static async checkAvailability(dateString, time) {
    try {
      console.log('Verificando disponibilidade para:', dateString, time);
      
      // Normalizar a data - formato esperado: "DD/MM-YYYY" ou "DD/MM/YYYY"
      const [dia, mesAno] = dateString.split('/');
      console.log('Dia:', dia, 'MesAno:', mesAno);
      
      // Consultar agendamentos para a data e horário específicos
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('data.mesAno', '==', mesAno),
        where('data.dia', '==', parseInt(dia)),
        where('data.horario', '==', time),
        where('status', 'in', ['pendente', 'confirmado']) // Considerar apenas agendamentos ativos
      );

      const querySnapshot = await getDocs(q);
      
      // Calcular total de pessoas agendadas
      let totalPessoas = 0;
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const adultos = booking.adultos?.length || 0;
        const criancas = booking.criancas?.length || 0;
        totalPessoas += adultos + criancas;
        console.log('Agendamento encontrado:', { 
          id: doc.id, 
          adultos, 
          criancas, 
          total: adultos + criancas 
        });
      });

      const maxLimit = 30;
      const available = totalPessoas < maxLimit;

      console.log('Resultado disponibilidade:', { 
        totalPessoas, 
        maxLimit, 
        available,
        vagasRestantes: maxLimit - totalPessoas
      });

      return {
        available,
        currentCount: totalPessoas,
        maxLimit,
        remaining: maxLimit - totalPessoas
      };

    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      // Em caso de erro, retorna como disponível para não bloquear o usuário
      return {
        available: true,
        currentCount: 0,
        maxLimit: 30,
        remaining: 30,
        error: true
      };
    }
  }

  // ✅ VERIFICAR CPF DUPLICADO (NOVA FUNÇÃO)
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
        // Verificar se o CPF está em algum adulto do agendamento
        const hasDuplicate = booking.adultos?.some(adulto => 
          adulto.cpf === cpf
        );
        if (hasDuplicate) return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao verificar CPF duplicado:', error);
      return false;
    }
  }
}

// ✅ EXPORT FUNÇÕES INDIVIDUAIS PARA COMPATIBILIDADE
export const checkAvailability = BookingService.checkAvailability;
export const checkDuplicateCPF = BookingService.checkDuplicateCPF;

export default BookingService;