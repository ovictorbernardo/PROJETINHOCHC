// src/components/admin/Calendar/DayCard.jsx
import React, { useState } from 'react';
import { useCalendarSyncManager } from '../../../core/managers/CalendarSyncManager';

const AdminDayCard = ({ day, diaIndex, onDaySelect }) => {
  const { updateHorario, updateDayAndSync } = useCalendarSyncManager();
  const [editandoHorarios, setEditandoHorarios] = useState(false);
  const [novosHorarios, setNovosHorarios] = useState(day.horarios || {});
  const [salvando, setSalvando] = useState(false);

  // Horários padrão iniciais se não existirem
  const horariosPadrao = {
    '08:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 },
    '10:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 },
    '14:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 }
  };

  // Status options com cores
  const statusOptions = [
    { value: 'disponivel', label: 'Disponível', color: 'bg-green-500', icon: '🟢' },
    { value: 'lotado', label: 'Lotado', color: 'bg-red-500', icon: '🔴' },
    { value: 'fechado', label: 'Fechado', color: 'bg-gray-500', icon: '⚫' },
    { value: 'indisponivel', label: 'Indisponível', color: 'bg-yellow-500', icon: '🟡' }
  ];

  /**
   * Inicia edição dos horários
   */
  const iniciarEdicao = () => {
    setNovosHorarios(day.horarios || horariosPadrao);
    setEditandoHorarios(true);
  };

  /**
   * Atualiza um horário específico
   */
  const atualizarHorario = (horarioKey, campo, valor) => {
    setNovosHorarios(prev => ({
      ...prev,
      [horarioKey]: {
        ...prev[horarioKey],
        [campo]: valor
      }
    }));
  };

  /**
   * Adiciona novo horário
   */
  const adicionarHorario = () => {
    const novoHorarioKey = Object.keys(novosHorarios).length + 1 + ':00';
    setNovosHorarios(prev => ({
      ...prev,
      [novoHorarioKey]: { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10 }
    }));
  };

  /**
   * Remove horário
   */
  const removerHorario = (horarioKey) => {
    if (Object.keys(novosHorarios).length <= 1) {
      alert('É necessário ter pelo menos 1 horário');
      return;
    }
    
    const { [horarioKey]: removido, ...resto } = novosHorarios;
    setNovosHorarios(resto);
  };

  /**
   * Salva os horários customizados
   */
  const salvarHorarios = async () => {
    if (Object.keys(novosHorarios).length === 0) {
      alert('Adicione pelo menos 1 horário');
      return;
    }

    setSalvando(true);
    try {
      // 🔄 SINCRONIZA COM O SISTEMA
      await updateDayAndSync(diaIndex, {
        horarios: novosHorarios,
        status: calcularStatusGeral(novosHorarios)
      });
      
      setEditandoHorarios(false);
    } catch (error) {
      console.error('❌ Erro ao salvar horários:', error);
      alert('Erro ao salvar horários');
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Cancela edição
   */
  const cancelarEdicao = () => {
    setNovosHorarios(day.horarios || horariosPadrao);
    setEditandoHorarios(false);
  };

  /**
   * Calcula status geral baseado nos horários
   */
  const calcularStatusGeral = (horarios) => {
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
   * Renderização do status do horário
   */
  const renderStatusHorario = (horario, horarioKey) => {
    const statusInfo = statusOptions.find(opt => opt.value === horario.status);
    return (
      <div className={`px-2 py-1 rounded text-white text-xs font-medium ${statusInfo?.color} flex items-center gap-1`}>
        <span className="text-xs">{statusInfo?.icon}</span>
        <span>{horarioKey}</span>
      </div>
    );
  };

  // Status geral do dia
  const statusGeral = calcularStatusGeral(day.horarios || {});
  const statusGeralInfo = statusOptions.find(opt => opt.value === statusGeral);

  return (
    <div 
      className={`
        border-2 rounded-lg p-3 cursor-pointer transition-all duration-200
        ${statusGeral === 'disponivel' ? 'bg-green-50 border-green-300 hover:bg-green-100' : ''}
        ${statusGeral === 'lotado' ? 'bg-red-50 border-red-300 hover:bg-red-100' : ''}
        ${statusGeral === 'fechado' ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' : ''}
        ${statusGeral === 'indisponivel' ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100' : ''}
        ${salvando ? 'opacity-50' : ''}
      `}
      onClick={() => !editandoHorarios && onDaySelect?.(day)}
    >
      {/* Cabeçalho do dia */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg">{day.dia}</div>
        {!editandoHorarios && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              iniciarEdicao();
            }}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
          >
            ⚙️ Horários
          </button>
        )}
      </div>

      {!editandoHorarios ? (
        // MODO VISUALIZAÇÃO
        <div className="space-y-2">
          {/* Status geral */}
          <div className="flex items-center gap-2">
            <span className="text-sm">{statusGeralInfo?.icon}</span>
            <span className="text-sm font-medium capitalize">{statusGeralInfo?.label}</span>
          </div>

          {/* Lista de horários */}
          <div className="space-y-1">
            {Object.entries(day.horarios || horariosPadrao).map(([horarioKey, horario]) => (
              <div key={horarioKey} className="flex justify-between items-center">
                {renderStatusHorario(horario, horarioKey)}
                <div className="text-xs text-gray-600">
                  {horario.lotacaoAtual}/{horario.lotacaoMaxima}
                </div>
              </div>
            ))}
          </div>

          {/* Observação */}
          {day.observacao && (
            <div className="text-xs text-gray-600 bg-white p-1 rounded border">
              📝 {day.observacao}
            </div>
          )}
        </div>
      ) : (
        // MODO EDIÇÃO DE HORÁRIOS
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="font-semibold text-center text-sm mb-2">Editar Horários</div>
          
          {/* Lista de horários editáveis */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(novosHorarios).map(([horarioKey, horario]) => (
              <div key={horarioKey} className="border rounded p-2 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="time"
                    value={horarioKey}
                    onChange={(e) => {
                      const novoKey = e.target.value;
                      const { [horarioKey]: antigo, ...resto } = novosHorarios;
                      setNovosHorarios({
                        ...resto,
                        [novoKey]: horario
                      });
                    }}
                    className="text-sm border rounded px-1 py-0.5"
                  />
                  <button
                    onClick={() => removerHorario(horarioKey)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ❌
                  </button>
                </div>
                
                <select
                  value={horario.status}
                  onChange={(e) => atualizarHorario(horarioKey, 'status', e.target.value)}
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
                      onChange={(e) => atualizarHorario(horarioKey, 'lotacaoMaxima', parseInt(e.target.value))}
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
                      onChange={(e) => atualizarHorario(horarioKey, 'lotacaoAtual', parseInt(e.target.value))}
                      className="w-full border rounded px-1"
                      min="0"
                      max={horario.lotacaoMaxima}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-2">
            <button
              onClick={adicionarHorario}
              className="text-xs bg-green-600 hover:bg-green-700 text-white py-1 rounded"
            >
              ➕ Adicionar Horário
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={salvarHorarios}
                disabled={salvando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-1 rounded text-xs"
              >
                {salvando ? '💾 Salvando...' : '💾 Salvar'}
              </button>
              <button
                onClick={cancelarEdicao}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 rounded text-xs"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDayCard;