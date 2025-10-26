// src/components/ui/EmptyState.jsx
import React from 'react';

const EmptyState = ({ 
  icon = '📭', 
  title = 'Nada por aqui', 
  message = 'Não encontramos nenhum conteúdo.',
  action 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;