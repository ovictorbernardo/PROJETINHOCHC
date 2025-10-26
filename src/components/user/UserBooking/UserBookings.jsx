// src/components/user/UserBookings/UserBookings.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import UserBookingsList from './UserBookingsList';
import { selectAllBookings } from '../../../store/slices/bookingSlice';
import { getNomeMes } from '../../../utils/initialData';

const UserBookings = ({ mesAno }) => {
  const bookings = useSelector(selectAllBookings);
  const [mes, ano] = mesAno.split('-').map(Number);
  const nomeMes = getNomeMes(mes);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Meus Agendamentos
        </h2>
        <p className="text-gray-600">
          {nomeMes} de {ano} - Museu CBMERJ
        </p>
      </div>

      <UserBookingsList 
        bookings={bookings} 
        mesAno={mesAno} 
      />
    </div>
  );
};

export default UserBookings;