import BookingRepository from '../../repositories/BookingRepository.js';

export async function createBooking(bookingData) {
  // Aqui entram regras de negócio puras
  if (!bookingData.nome || !bookingData.email) {
    throw new Error('Nome e e-mail são obrigatórios.');
  }

  // Define defaults
  const now = new Date().toISOString();
  const data = {
    ...bookingData,
    status: 'pendente',
    createdAt: now,
    updatedAt: now
  };

  const result = await BookingRepository.create(data);
  return { id: result.id, ...data };
}
