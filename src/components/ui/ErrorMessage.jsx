// src/components/ui/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ title = 'Erro', message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <div className="text-red-600 text-4xl mb-2">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;