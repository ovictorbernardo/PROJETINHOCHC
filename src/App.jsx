// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🎯 SOLID MANAGERS & RENDERERS
import { useAppContentManager } from './core/managers/AppContentManager';
import { MonthHeaderRenderer } from './core/renderers/MonthHeaderRenderer';
import { ViewContentRenderer } from './core/renderers/ViewContentRenderer';

// 🎯 HANDLERS & CONTROLLERS
import handleBookingSubmit from './core/handlers/bookingHandler';
import handleDaySelect from './core/handlers/calendarHandler';
import handleToggleDisponibilidade from './core/handlers/availabilityHandler';
import createMonthController from './core/navigation/monthController';
import createViewManager from './core/navigation/viewManager';

// 🎯 CONTEXTS & COMPONENTS
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import AdminLogin from './components/auth/AdminLogin';

// 🎯 REDUX IMPORTS (apenas para dispatch)
import { useDispatch } from 'react-redux';
import { setSelectedDay } from './store/slices/uiSlice';

/**
 * AppContent SOLID - Apenas composição
 */
const AppContent = () => {
  const { state, actions } = useAppContentManager();
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();

  // 🎯 CONTROLLERS
  const monthController = createMonthController({ 
    dispatch, 
    currentMesAno: state.currentMesAno 
  });
  
  const viewManager = createViewManager({ 
    dispatch, 
    isAdmin, 
    navigate: null 
  });

  // 🎯 HANDLERS
  const onBookingSubmit = handleBookingSubmit({ 
    dispatch, 
    setError: actions.setError, 
    setSelectedDay: (d) => dispatch(setSelectedDay(d))
  });

  const onDaySelect = handleDaySelect({ 
    dispatch, 
    currentView: state.currentView, 
    alertFn: alert 
  });

  const toggleDisponibilidade = handleToggleDisponibilidade({ 
    dispatch, 
    currentMesAno: state.currentMesAno, 
    setError: actions.setError 
  });

  // 🎯 NAVEGAÇÃO
  const handleProximoMes = () => monthController.goNext();
  const handleMesAnterior = () => monthController.goPrev();
  const handleMesAtual = () => monthController.goCurrent();
  
  const handleViewChange = (view) => {
    const res = viewManager.changeTo(view);
    if (!res.ok) return;
    
    if (view === 'admin' && !user) {
      window.location.href = '/admin/login';
    }
  };

  return (
    <Layout currentView={state.currentView} onViewChange={handleViewChange}>
      {/* Month Header */}
      <MonthHeaderRenderer
        currentMesAno={state.currentMesAno}
        agenda={state.agenda}
        agendaLoading={state.agendaLoading}
        bookingsLoading={state.bookingsLoading}
        error={state.error}
        agendaError={state.agendaError}
        currentView={state.currentView}
        isAdmin={isAdmin}
        onMesAnterior={handleMesAnterior}
        onProximoMes={handleProximoMes}
        onMesAtual={handleMesAtual}
        onToggleDisponibilidade={toggleDisponibilidade}
        onRetry={actions.handleRetry}
      />

      {/* View Content */}
      <ViewContentRenderer
        state={state}
        onBookingSubmit={onBookingSubmit}
        onDaySelect={onDaySelect}
        onToggleDisponibilidade={toggleDisponibilidade}
      />
    </Layout>
  );
};

/**
 * App Principal - Apenas roteamento
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AppContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meus-agendamentos" 
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;