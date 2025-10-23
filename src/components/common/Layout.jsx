import React from 'react';
import Toolbar from './Toolbar';

const Layout = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toolbar currentView={currentView} onViewChange={onViewChange} />
      <main className="container mx-auto p-4 pt-6">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>Museu do Centro Histórico e Cultural do Corpo de Bombeiros Militar do Estado do Rio de Janeiro</p>
          <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} - Todos os direitos reservados - ASTI</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;