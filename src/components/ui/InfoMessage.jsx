// src/components/ui/InfoMessage.jsx
import React from 'react';

const InfoMessage = ({ title = 'Informação', message, icon = 'ℹ️' }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <span className="text-blue-600 text-xl mr-3">{icon}</span>
        <div>
          <h3 className="text-sm font-semibold text-blue-800 mb-1">{title}</h3>
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoMessage;