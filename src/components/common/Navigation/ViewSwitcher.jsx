// src/components/common/Navigation/ViewSwitcher.jsx
import React from 'react';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'visitante', label: 'Visitante', icon: '🏛️', shortLabel: 'Visitante' },
    { id: 'admin', label: 'Admin', icon: '⚙️', shortLabel: 'Admin' },
    { id: 'meus-agendamentos', label: 'Meus Agendamentos', icon: '📋', shortLabel: 'Agendamentos' }
  ];

  return (
    <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
            currentView === view.id
              ? 'bg-white text-blue-600 shadow-sm font-semibold'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
          }`}
        >
          <span className="hidden sm:inline">{view.icon}</span>
          <span className="hidden sm:inline">{view.label}</span>
          <span className="sm:hidden">{view.shortLabel}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;