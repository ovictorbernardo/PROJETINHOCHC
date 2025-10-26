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

  // ✅ NOVO: Buscar todos os agendamentos
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
}