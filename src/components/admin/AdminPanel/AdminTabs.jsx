// src/components/admin/AdminPanel/AdminTabs.jsx
import React from 'react';

const AdminTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'agenda', label: '📅 Configurar Agenda', icon: '📅' },
    { id: 'reservas', label: '📋 Gerenciar Reservas', icon: '📋' }
  ];

  return (
    <nav className="flex">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-medium ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default AdminTabs;