// src/components/views/AdminView.jsx
import React from 'react';
// 🆕 ATUALIZADO: Import do AdminPanel modular
import AdminPanel from '../admin/AdminPanel/AdminPanel';

const AdminView = ({ 
  currentMesAno, 
  agenda, 
  onToggleDisponibilidade 
}) => {
  return (
    <AdminPanel
      mesAno={currentMesAno}
      agenda={agenda}
      onToggleDisponibilidade={onToggleDisponibilidade}
    />
  );
};

export default AdminView;