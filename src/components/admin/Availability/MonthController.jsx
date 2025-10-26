// src/components/admin/Availability/MonthController.jsx
import React, { useState } from 'react';
import { getNomeMes } from '../../../utils/initialData';
// 🆕 ADICIONADO: Import do ConfirmationModal
import ConfirmationModal from '../../ui/ConfirmationModal';

const MonthController = ({ mesAno, mesDisponivel, onToggleDisponibilidade }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(''); // 'liberar' | 'bloquear'

  const [mes, ano] = mesAno.split('-').map(Number);
  const nomeMes = getNomeMes(mes);

  const handleToggleClick = (liberar) => {
    setActionType(liberar ? 'liberar' : 'bloquear');
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onToggleDisponibilidade(actionType === 'liberar');
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            mesDisponivel 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              mesDisponivel ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {mesDisponivel ? 'Mês Liberado' : 'Mês Bloqueado'}
          </span>
          <p className="text-sm text-gray-600 mt-1">
            {mesDisponivel 
              ? 'Agendamentos abertos para este mês' 
              : 'Agendamentos fechados para este mês'
            }
          </p>
          
          {mesDisponivel && (
            <p className="text-xs text-green-600 mt-1">
              📊 {nomeMes} de {ano} - Disponível para agendamentos
            </p>
          )}
        </div>
        
        <div className="space-x-2">
          {!mesDisponivel && (
            <button
              onClick={() => handleToggleClick(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              ✅ Liberar Mês
            </button>
          )}
          {mesDisponivel && (
            <button
              onClick={() => handleToggleClick(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              ⏸️ Bloquear Mês
            </button>
          )}
        </div>
      </div>

      {/* 🆕 ADICIONADO: Modal de confirmação */}
      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={actionType === 'liberar' ? 'Liberar Mês' : 'Bloquear Mês'}
        message={
          actionType === 'liberar' 
            ? `Tem certeza que deseja liberar ${nomeMes} de ${ano} para agendamentos? Todos os dias ficarão disponíveis.`
            : `Tem certeza que deseja bloquear ${nomeMes} de ${ano}? Nenhum novo agendamento poderá ser feito.`
        }
        confirmText={actionType === 'liberar' ? 'Liberar Mês' : 'Bloquear Mês'}
        type={actionType === 'liberar' ? 'info' : 'warning'}
      />
    </>
  );
};

export default MonthController;