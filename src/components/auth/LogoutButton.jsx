// src/components/auth/LogoutButton.jsx (atualizado)
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ variant = 'default' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair do sistema administrativo?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  if (variant === 'header') {
    return (
      <button 
        onClick={handleLogout}
        className="logout-button header"
        title="Sair do sistema"
      >
        <span className="logout-icon">🚪</span>
        Sair
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <button 
        onClick={handleLogout}
        className="logout-dropdown-btn"
      >
        <span className="logout-icon">🚪</span>
        Sair do Sistema
      </button>
    );
  }

  return (
    <button 
      onClick={handleLogout}
      className="logout-button default"
    >
      Sair do Sistema
    </button>
  );
};

export default LogoutButton;