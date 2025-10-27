// src/components/admin/Management/CalendarSettings/DaySettingsCard.jsx
import React, { useState } from 'react';

const DaySettingsCard = ({ day, onUpdateDay, mesAno }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(day.status);
  const [observacao, setObservacao] = useState(day.observacao || '');
  const [saving, setSaving] = useState(false);

  const statusOptions = [
    { value: 'disponivel', label: 'Disponível', color: 'bg-green-100 border-green-500', icon: '🟢' },
    { value: 'lotado', label: 'Lotado', color: 'bg-red-100 border-red-500', icon: '🔴' },
    { value: 'fechado', label: 'Fechado', color: 'bg-gray-100 border-gray-500', icon: '⚫' },
    { value: 'indisponivel', label: 'Indisponível', color: 'bg-yellow-100 border-yellow-500', icon: '🟡' }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await onUpdateDay(day.dia, { status, observacao });
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setStatus(day.status);
    setObservacao(day.observacao || '');
    setIsEditing(false);
  };

  const currentStatus = statusOptions.find(opt => opt.value === day.status);

  return (
    <div
      className={`border-2 p-3 rounded-lg transition-all duration-200 ${
        currentStatus?.color || 'bg-blue-100 border-blue-500'
      } ${saving ? 'opacity-50' : ''}`}
    >
      {!isEditing ? (
        // Modo visualização
        <div className="text-center">
          <div className="font-bold text-lg mb-1">{day.dia}</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span>{currentStatus?.icon}</span>
            <span className="text-sm font-medium capitalize">{currentStatus?.label}</span>
          </div>
          {day.observacao && (
            <div
              className="text-xs text-gray-600 mb-2 px-2 py-1 bg-white rounded border"
              title={day.observacao}
            >
              📝 {day.observacao.length > 20 ? `${day.observacao.substring(0, 20)}...` : day.observacao}
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            {saving ? 'Salvando...' : 'Editar'}
          </button>
        </div>
      ) : (
        // Modo edição
        <div className="space-y-2">
          <div className="font-bold text-center text-lg">{day.dia}</div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={saving}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Observação:</label>
            <input
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Banda do CBMERJ, Evento especial..."
              disabled={saving}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                '💾 Salvar'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-2 py-2 rounded text-sm font-medium transition-colors"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySettingsCard;
