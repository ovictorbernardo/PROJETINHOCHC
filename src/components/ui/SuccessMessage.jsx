// src/components/ui/SuccessMessage.jsx
import React from 'react';

const SuccessMessage = ({ title = 'Sucesso!', message, onClose }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
      <div className="text-green-600 text-4xl mb-2">✅</div>
      <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
      <p className="text-green-700 mb-4">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Fechar
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;