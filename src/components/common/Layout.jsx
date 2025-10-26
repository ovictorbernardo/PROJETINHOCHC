// src/components/common/Layout.jsx
import React from 'react';
import ViewSwitcher from './Navigation/ViewSwitcher';

const Layout = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="bg-red-600 text-white p-2 rounded-lg mr-3">
                <span className="text-xl">🚒</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Agendamento - Visitação ao Quartel Central
                
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  CHC - Corpo de Bombeiros Militar do Estado do Rio de Janeiro
                
                </p>
              </div>
            </div>
            
            {/* 🆕 MELHORADO: ViewSwitcher responsivo */}
            <ViewSwitcher 
              currentView={currentView} 
              onViewChange={onViewChange} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base">© 2025  Corpo de Bombeiros Militar do Estado do Rio de Janeiro</p>
            <p className="text-xs sm:text-sm mt-1">ASTI - Versão 4.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;