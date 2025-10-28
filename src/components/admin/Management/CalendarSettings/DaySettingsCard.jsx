// src/components/admin/Management/CalendarSettings/DaySettingsCard.jsx
import React, { useState } from 'react';
import { useCalendarSyncManager } from '../../../../core/managers/CalendarSyncManager';

const DaySettingsCard = ({ day, onUpdateDay, mesAno }) => {
  const { updateDayAndSync } = useCalendarSyncManager();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado para controle dos horários CUSTOMIZÁVEIS
  const [horarios, setHorarios] = useState(day.horarios || {});
  const [observacao, setObservacao] = useState(day.observacao || '');

  // Status disponíveis
  const statusOptions = [
    { value: 'disponivel', label: 'Disponível', color: 'bg-green-100 border-green-500', icon: '🟢' },
    { value: 'lotado', label: 'Lotado', color: 'bg-red-100 border-red-500', icon: '🔴' },
    { value: 'fechado', label: 'Fechado', color: 'bg-gray-100 border-gray-500', icon: '⚫' },
    { value: 'indisponivel', label: 'Indisponível', color: 'bg-yellow-100 border-yellow-500', icon: '🟡' }
  ];

  // Horários padrão iniciais se não existirem
  const horariosPadrao = {
    '08:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 },
    '10:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 },
    '14:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 }
  };

  /**
   * Inicia edição dos horários customizáveis
   */
  const iniciarEdicaoHorarios = () => {
    setHorarios(day.horarios || horariosPadrao);
    setIsEditing(true);
  };

  /**
   * Atualiza um horário específico
   */
  const handleHorarioChange = (horarioKey, campo, valor) => {
    setHorarios(prev => ({
      ...prev,
      [horarioKey]: {
        ...prev[horarioKey],
        [campo]: valor
      }
    }));
  };

  /**
   * Adiciona novo horário customizado
   */
  const adicionarHorario = () => {
    const novoHorarioKey = prompt('Digite o novo horário (ex: 09:00):');
    if (!novoHorarioKey || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(novoHorarioKey)) {
      alert('Horário inválido! Use formato HH:MM');
      return;
    }

    setHorarios(prev => ({
      ...prev,
      [novoHorarioKey]: { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 }
    }));
  };

  /**
   * Remove horário
   */
  const removerHorario = (horarioKey) => {
    if (Object.keys(horarios).length <= 1) {
      alert('É necessário ter pelo menos 1 horário');
      return;
    }
    
    const { [horarioKey]: removido, ...resto } = horarios;
    setHorarios(resto);
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

  /**
   * Salva os horários customizados
   */
  const handleSave = async () => {
    if (Object.keys(horarios).length === 0) {
      alert('Adicione pelo menos 1 horário');
      return;
    }

    setSaving(true);
    try {
      // Prepara os dados atualizados
      const updates = {
        horarios: horarios,
        observacao: observacao,
        status: getStatusGeral() // Status calculado automaticamente
      };

      // 🔄 SINCRONIZAÇÃO COM O SISTEMA
      const diaIndex = parseInt(day.dia) - 1; // Assumindo que day.dia é o número do dia
      const result = await updateDayAndSync(diaIndex, updates);
      
      if (result.success) {
        setIsEditing(false);
        if (onUpdateDay) {
          onUpdateDay(day.dia, updates);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar horários');
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
          
          {/* Mini status dos horários CUSTOMIZÁVEIS */}
          <div className="space-y-1 mb-2">
            {Object.entries(horarios).map(([horarioKey, horario]) => {
              const statusInfo = statusOptions.find(opt => opt.value === horario.status);
              
              return (
                <div key={horarioKey} className="flex justify-between items-center text-xs">
                  <span>{horarioKey}</span>
                  <div className="flex items-center gap-1">
                    <span className={`
                      px-1 rounded text-white text-xs
                      ${horario.status === 'disponivel' ? 'bg-green-500' : ''}
                      ${horario.status === 'lotado' ? 'bg-red-500' : ''}
                      ${horario.status === 'fechado' ? 'bg-gray-500' : ''}
                      ${horario.status === 'indisponivel' ? 'bg-yellow-500' : ''}
                    `}>
                      {statusInfo?.icon}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({horario.lotacaoAtual}/{horario.lotacaoMaxima})
                    </span>
                  </div>
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
            onClick={iniciarEdicaoHorarios}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            ⚙️ Horários
          </button>
        </div>
      ) : (
        // MODO EDIÇÃO DE HORÁRIOS CUSTOMIZÁVEIS
        <div className="space-y-3">
          <div className="font-bold text-center text-lg">{day.dia}</div>

          {/* Lista de horários editáveis */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <label className="block text-xs font-semibold text-gray-700">Horários Customizáveis:</label>
            {Object.entries(horarios).map(([horarioKey, horario]) => (
              <div key={horarioKey} className="border rounded p-2 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="time"
                    value={horarioKey}
                    onChange={(e) => {
                      const novoKey = e.target.value;
                      const { [horarioKey]: antigo, ...resto } = horarios;
                      setHorarios({
                        ...resto,
                        [novoKey]: horario
                      });
                    }}
                    className="text-sm border rounded px-1 py-0.5"
                  />
                  <button
                    onClick={() => removerHorario(horarioKey)}
                    className="text-red-600 hover:text-red-800 text-xs"
                    disabled={Object.keys(horarios).length <= 1}
                  >
                    ❌
                  </button>
                </div>
                
                <select
                  value={horario.status}
                  onChange={(e) => handleHorarioChange(horarioKey, 'status', e.target.value)}
                  className="w-full text-xs border rounded p-1 mb-1"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <label>Lot. Máx:</label>
                    <input
                      type="number"
                      value={horario.lotacaoMaxima}
                      onChange={(e) => handleHorarioChange(horarioKey, 'lotacaoMaxima', parseInt(e.target.value))}
                      className="w-full border rounded px-1"
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <label>Ocupadas:</label>
                    <input
                      type="number"
                      value={horario.lotacaoAtual}
                      onChange={(e) => handleHorarioChange(horarioKey, 'lotacaoAtual', parseInt(e.target.value))}
                      className="w-full border rounded px-1"
                      min="0"
                      max={horario.lotacaoMaxima}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão para adicionar horário */}
          <button
            onClick={adicionarHorario}
            className="w-full text-xs bg-green-600 hover:bg-green-700 text-white py-1 rounded"
          >
            ➕ Adicionar Horário
          </button>

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