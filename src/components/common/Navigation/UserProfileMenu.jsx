// src/components/common/Navigation/UserProfileMenu.jsx
import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import LogoutButton from '../../auth/LogoutButton';

const UserProfileMenu = ({ user, isAdmin, currentView, onViewChange, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  if (!user) {
    return (
      <button
        onClick={() => onViewChange('admin')}
        className="profile-btn guest"
        title="Área Administrativa"
      >
        <span className="profile-btn-icon">⚙️</span>
        <span className="profile-btn-text">Admin</span>
      </button>
    );
  }

  return (
    <div className="profile-menu" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`profile-btn ${isOpen ? 'profile-btn-active' : ''}`}
        title="Menu do Usuário"
      >
        <div className="profile-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <span className="profile-name">
          {user.email.split('@')[0]}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'dropdown-arrow-open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          {/* 👤 INFO DO USUÁRIO */}
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-avatar">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="user-email">{user.email}</p>
                {isAdmin && (
                  <span className="admin-badge">Administrador</span>
                )}
              </div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {/* 📊 MENU ADMIN */}
          {isAdmin && (
            <>
              <button
                onClick={() => onViewChange('admin')}
                className={`dropdown-item ${currentView === 'admin' ? 'dropdown-item-active' : ''}`}
              >
                <span className="item-icon">📊</span>
                Painel Administrativo
              </button>
              <div className="dropdown-divider"></div>
            </>
          )}

          {/* 🚪 LOGOUT */}
          <div className="dropdown-item logout-item">
            <LogoutButton variant="dropdown" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;