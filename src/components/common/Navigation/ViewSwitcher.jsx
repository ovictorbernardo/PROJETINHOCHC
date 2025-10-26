// src/components/common/Navigation/ViewSwitcher.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import UserProfileMenu from './UserProfileMenu';
import './ViewSwitcher.css';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const { user, isAdmin } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsProfileOpen(false);
  };

  return (
    <div className="modern-view-switcher">
      {/* 📱 MENU PRINCIPAL */}
      <nav className="view-nav">
        <button
          onClick={() => handleViewChange('visitante')}
          className={`nav-btn ${currentView === 'visitante' ? 'nav-btn-active' : ''}`}
        >
          <span className="nav-btn-icon">📅</span>
          <span className="nav-btn-text">Agendar Visita</span>
        </button>

        <button
          onClick={() => handleViewChange('meus-agendamentos')}
          className={`nav-btn ${currentView === 'meus-agendamentos' ? 'nav-btn-active' : ''}`}
        >
          <span className="nav-btn-icon">📋</span>
          <span className="nav-btn-text">Meus Agendamentos</span>
        </button>
      </nav>

      {/* 👤 PERFIL DO USUÁRIO */}
      <div className="view-profile">
        <UserProfileMenu 
          user={user}
          isAdmin={isAdmin}
          currentView={currentView}
          onViewChange={handleViewChange}
          isOpen={isProfileOpen}
          onToggle={() => setIsProfileOpen(!isProfileOpen)}
        />
      </div>
    </div>
  );
};

export default ViewSwitcher;