import React from 'react';
// ✅ Este não importa outros arquivos

const Toolbar = ({ currentView, onViewChange }) => {
  const navigationItems = [
    { key: 'visitante', label: ' Agenda Pública', icon: '🏠' },
    { key: 'meus-agendamentos', label: ' Meus Agendamentos', icon: '📋' },
    { key: 'admin', label: ' Área do Administrador', icon: '⚙️' }
  ];

  return (
    <header className="bg-red-600 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2">
              <span className="text-red-600 text-xl">🚒</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Visitação ao Quartel Central - Agendamento </h1>
              <p className="text-red-100 text-sm">Corpo de Bombeiros Militar do Estado do Rio de Janeiro</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={`px-4 py-2 rounded transition-colors flex items-center space-x-2 ${
                  currentView === item.key 
                    ? 'bg-white text-red-600 font-semibold shadow-md' 
                    : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="text-sm text-red-100 bg-red-700 px-3 py-1 rounded-full">
            {currentView === 'admin' ? '🔧 Modo Administrador' : '👤 Modo Visitante'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;