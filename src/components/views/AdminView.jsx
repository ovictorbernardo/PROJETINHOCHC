// src/components/views/AdminView.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutButton from '../auth/LogoutButton';
import AdminPanel from '../admin/AdminPanel/AdminPanel';
import './AdminView.css';

const AdminView = ({ 
  currentMesAno, 
  agenda, 
  onToggleDisponibilidade 
}) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="admin-view">
      {/* 🆕 HEADER COM LOGOUT */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Painel Administrativo</h1>
            <span className="admin-badge">Quartel Central CBMERJ</span>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              {isAdmin && <span className="admin-tag">Admin</span>}
            </div>
            <LogoutButton variant="header" />
          </div>
        </div>
      </header>

      {/* CONTEÚDO ADMIN EXISTENTE */}
      <div className="admin-content">
        <AdminPanel
          mesAno={currentMesAno}
          agenda={agenda}
          onToggleDisponibilidade={onToggleDisponibilidade}
        />
      </div>
    </div>
  );
};

export default AdminView;