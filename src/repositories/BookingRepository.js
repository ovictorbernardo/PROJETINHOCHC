import BookingService from '../services/bookingService';

export class BookingRepository {
  static async create(bookingData) {
    return await BookingService.createBooking(bookingData);
  }

  static async getAll() {
    return await BookingService.getAllBookings();
  }

  static async update(id, data) {
    return await BookingService.updateBooking(id, data);
  }

  static async delete(id) {
    return await BookingService.deleteBooking(id);
  }
}

export default BookingRepository;
