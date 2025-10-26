// src/components/common/Navigation/MonthNavigation.jsx
import React from 'react';
import { getMesAnoAtual, getNomeMes } from '../../../utils/initialData';

const MonthNavigation = ({ 
  currentMesAno, 
  onMesAnterior, 
  onProximoMes, 
  onMesAtual 
}) => {
  const [mes, ano] = currentMesAno.split('-').map(Number);
  const nomeMes = getNomeMes(mes);
  const isCurrentMonth = currentMesAno === getMesAnoAtual();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMesAnterior}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          ◀ Mês Anterior
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {nomeMes} de {ano}
          </h2>
          <p className="text-sm text-gray-600">
            Mês 
          </p>
        </div>
        
        <button
          onClick={onProximoMes}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Próximo Mês ▶
        </button>
      </div>

      {!isCurrentMonth && (
        <button
          onClick={onMesAtual}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Voltar ao Mês Atual
        </button>
      )}
    </div>
  );
};

export default MonthNavigation;