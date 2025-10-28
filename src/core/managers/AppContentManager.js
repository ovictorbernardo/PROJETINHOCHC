// src/core/managers/AppContentManager.js
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { 
  fetchAgendaData,
  selectCurrentAgenda,
  selectCurrentMesAno,
  selectAgendaLoading,
  selectAgendaError
} from '../../store/slices/agendaSlice';
import { 
  selectBookingsLoading
} from '../../store/slices/bookingSlice';
import { 
  selectCurrentView,
  selectSelectedDay,
  selectBookingFormLoading
} from '../../store/slices/uiSlice';

export const useAppContentManager = () => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  
  // Redux Selectors
  const currentView = useSelector(selectCurrentView);
  const selectedDay = useSelector(selectSelectedDay);
  const bookingFormLoading = useSelector(selectBookingFormLoading);
  const currentMesAno = useSelector(selectCurrentMesAno);
  const agenda = useSelector(selectCurrentAgenda);
  const agendaLoading = useSelector(selectAgendaLoading);
  const agendaError = useSelector(selectAgendaError);
  const bookingsLoading = useSelector(selectBookingsLoading);

  // Local State
  const [error, setError] = useState(null);

  // Effects
  useEffect(() => {
    const loadAgendaData = async () => {
      try {
        setError(null);
        await dispatch(fetchAgendaData(currentMesAno));
      } catch (err) {
        setError('Erro ao carregar agenda do mês');
        console.error('Erro ao carregar agenda:', err);
      }
    };

    loadAgendaData();
  }, [dispatch, currentMesAno]);

  return {
    // State
    state: {
      currentView,
      selectedDay,
      bookingFormLoading,
      currentMesAno,
      agenda,
      agendaLoading,
      agendaError,
      bookingsLoading,
      error,
      user,
      isAdmin
    },
    
    // Actions
    actions: {
      setError,
      handleRetry: () => {
        setError(null);
        dispatch(fetchAgendaData(currentMesAno));
      }
    }
  };
};