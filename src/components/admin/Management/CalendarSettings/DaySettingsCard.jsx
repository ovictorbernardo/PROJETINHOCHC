// src/components/admin/Management/CalendarSettings/DaySettingsCard.jsx
import React, { useState } from 'react';

const DaySettingsCard = ({ day, onUpdateDay, mesAno }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado para controle dos horários
  const [horarios, setHorarios] = useState(day.horarios || {});
  const [observacao, setObservacao] = useState(day.observacao || '');

  // Status disponíveis
  const statusOptions = [
    { value: 'disponivel', label: 'Disponível', color: 'bg-green-100 border-green-500', icon: '🟢' },
    { value: 'lotado', label: 'Lotado', color: 'bg-red-100 border-red-500', icon: '🔴' },
    { value: 'fechado', label: 'Fechado', color: 'bg-gray-100 border-gray-500', icon: '⚫' },
    { value: 'indisponivel', label: 'Indisponível', color: 'bg-yellow-100 border-yellow-500', icon: '🟡' }
  ];

  // Horários padrão do sistema
  const horariosPadrao = ['08:00', '10:00', '14:00'];

  /**
   * Atualiza o status de um horário específico
   */
  const handleHorarioChange = (horarioKey, novoStatus) => {
    setHorarios(prev => ({
      ...prev,
      [horarioKey]: {
        ...prev[horarioKey],
        status: novoStatus
      }
    }));
  };

  /**
   * Calcula o status geral do dia baseado nos horários
   */
  const getStatusGeral = () => {
    const horariosArray = Object.values(horarios);
    if (horariosArray.length === 0) return 'indisponivel';
    
    const todosLotados = horariosArray.every(h => h.status === 'lotado');
    const todosFechados = horariosArray.every(h => h.status === 'fechado');
    const algumDisponivel = horariosArray.some(h => h.status === 'disponivel');

    if (todosLotados) return 'lotado';
    if (todosFechados) return 'fechado';
    if (algumDisponivel) return 'disponivel';
    return 'indisponivel';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepara os dados atualizados
      const updates = {
        horarios: horarios,
        observacao: observacao,
        status: getStatusGeral() // Status calculado automaticamente
      };

      const success = await onUpdateDay(day.dia, updates);
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
    setHorarios(day.horarios || {});
    setObservacao(day.observacao || '');
    setIsEditing(false);
  };

  const statusGeral = getStatusGeral();
  const currentStatus = statusOptions.find(opt => opt.value === statusGeral);

  return (
    <div
      className={`border-2 p-3 rounded-lg transition-all duration-200 ${
        currentStatus?.color || 'bg-blue-100 border-blue-500'
      } ${saving ? 'opacity-50' : ''}`}
    >
      {!isEditing ? (
        // MODO VISUALIZAÇÃO
        <div className="text-center">
          <div className="font-bold text-lg mb-1">{day.dia}</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span>{currentStatus?.icon}</span>
            <span className="text-sm font-medium capitalize">{currentStatus?.label}</span>
          </div>
          
          {/* Mini status dos horários */}
          <div className="space-y-1 mb-2">
            {horariosPadrao.map(horarioKey => {
              const horario = horarios[horarioKey];
              const statusHorario = horario?.status || 'indisponivel';
              const statusInfo = statusOptions.find(opt => opt.value === statusHorario);
              
              return (
                <div key={horarioKey} className="flex justify-between items-center text-xs">
                  <span>{horarioKey}</span>
                  <span className={`
                    px-1 rounded text-white text-xs
                    ${statusHorario === 'disponivel' ? 'bg-green-500' : ''}
                    ${statusHorario === 'lotado' ? 'bg-red-500' : ''}
                    ${statusHorario === 'fechado' ? 'bg-gray-500' : ''}
                    ${statusHorario === 'indisponivel' ? 'bg-yellow-500' : ''}
                  `}>
                    {statusInfo?.icon}
                  </span>
                </div>
              );
            })}
          </div>

          {observacao && (
            <div className="text-xs text-gray-600 mb-2 px-2 py-1 bg-white rounded border">
              📝 {observacao.length > 20 ? `${observacao.substring(0, 20)}...` : observacao}
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
        // MODO EDIÇÃO
        <div className="space-y-3">
          <div className="font-bold text-center text-lg">{day.dia}</div>

          {/* Controle de horários */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">Horários:</label>
            {horariosPadrao.map(horarioKey => {
              const horario = horarios[horarioKey] || { status: 'indisponivel' };
              
              return (
                <div key={horarioKey} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{horarioKey}</span>
                  <select
                    value={horario.status}
                    onChange={(e) => handleHorarioChange(horarioKey, e.target.value)}
                    disabled={saving}
                    className="text-xs p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Observação */}
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

          {/* Status geral (automático) */}
          <div className="text-xs text-gray-500 text-center">
            Status geral: <strong className="capitalize">{statusGeral}</strong>
          </div>

          {/* Botões */}
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