// src/components/ui/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Confirmação",
  message = "Tem certeza que deseja realizar esta ação?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const buttonStyles = {
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  const icon = {
    warning: '⚠️',
    danger: '🚨',
    info: 'ℹ️'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`border rounded-lg max-w-md w-full p-6 ${typeStyles[type]}`}>
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icon[type]}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <p className="mb-6">{message}</p>
        
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-2 rounded-lg transition-colors ${buttonStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;