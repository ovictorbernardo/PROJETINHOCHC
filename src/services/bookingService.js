import { db } from './firebase.js';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export class BookingService {
  static async createBooking(bookingData) {
    return await addDoc(collection(db, 'public/data/agendamentos'), {
      ...bookingData,
      status: 'pendente',
      createdAt: new Date().toISOString()
    });
  }

  static subscribeToBookings(callback, filters = {}) {
    let q = collection(db, 'public/data/agendamentos');
    
    const conditions = [];
    if (filters.mesAno) {
      conditions.push(where('mesAno', '==', filters.mesAno));
    }
    
    if (conditions.length > 0) {
      q = query(q, ...conditions, orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(bookings);
    });
  }

  static async updateBookingStatus(bookingId, status) {
    const bookingRef = doc(db, 'public/data/agendamentos', bookingId);
    await updateDoc(bookingRef, { status });
  }
}