// src/components/admin/Management/CalendarSettings/DaySettingsCard.jsx - ATUALIZADO COM DEBUG
import React, { useState, useEffect } from 'react';
import { useCalendarSyncManager } from '../../../../core/managers/CalendarSyncManager';
import { saveDayConfigToFirebase, BookingService } from '../../../../services/bookingService';

const DaySettingsCard = ({ day, onUpdateDay, mesAno }) => {
  const { updateDayAndSync } = useCalendarSyncManager();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  
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
    '08:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10, disponivel: true },
    '10:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10, disponivel: true },
    '14:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10, disponivel: true },
    '16:00': { status: 'disponivel', lotacaoAtual: 0, lotacaoMaxima: 10, disponivel: true }
  };

  // 🆕 CARREGAR DADOS REAIS DE AGENDAMENTOS
  useEffect(() => {
    if (isEditing) {
      loadRealBookingData();
    }
  }, [isEditing, day.dia, mesAno]);

  const loadRealBookingData = async () => {
    try {
      setSyncStatus('Sincronizando com agendamentos reais...');
      
      const updatedHorarios = { ...horarios };
      let hasChanges = false;

      // 🎯 PARA CADA HORÁRIO, BUSCAR AGENDAMENTOS REAIS
      for (const [timeKey, horarioConfig] of Object.entries(updatedHorarios)) {
        const realBookingsCount = await BookingService.countRealBookingsForTimeSlot(
          mesAno, 
          parseInt(day.dia), 
          timeKey
        );

        // 🎯 ATUALIZAR SE HOUVER DIFERENÇA
        if (realBookingsCount !== horarioConfig.lotacaoAtual) {
          updatedHorarios[timeKey] = {
            ...horarioConfig,
            lotacaoAtual: realBookingsCount,
            // 🎯 ATUALIZAR STATUS AUTOMATICAMENTE SE NECESSÁRIO
            status: realBookingsCount >= horarioConfig.lotacaoMaxima ? 'lotado' : horarioConfig.status
          };
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setHorarios(updatedHorarios);
        setSyncStatus('Sincronizado com agendamentos reais ✅');
      } else {
        setSyncStatus('Dados já sincronizados ✅');
      }
    } catch (error) {
      console.error('Erro ao sincronizar dados reais:', error);
      setSyncStatus('Erro na sincronização ❌');
    }
  };

  /**
   * Inicia edição dos horários customizáveis
   */
  const iniciarEdicaoHorarios = () => {
    console.log('🔍 [DEBUG] Iniciando edição para dia:', day.dia);
    setHorarios(day.horarios || horariosPadrao);
    setObservacao(day.observacao || '');
    setIsEditing(true);
    setSyncStatus('Pronto para editar');
  };

  /**
   * Atualiza um horário específico
   */
  const handleHorarioChange = (horarioKey, campo, valor) => {
    console.log('🔍 [DEBUG] Alterando horário:', { horarioKey, campo, valor });
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
      alert('Horário inválido! Use formato HH:MM (ex: 09:00, 14:30)');
      return;
    }

    if (horarios[novoHorarioKey]) {
      alert('Este horário já existe!');
      return;
    }

    console.log('🔍 [DEBUG] Adicionando novo horário:', novoHorarioKey);
    setHorarios(prev => ({
      ...prev,
      [novoHorarioKey]: { 
        status: 'disponivel', 
        lotacaoAtual: 0, 
        lotacaoMaxima: 10,
        disponivel: true
      }
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
    
    console.log('🔍 [DEBUG] Removendo horário:', horarioKey);
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
    setSyncStatus('Salvando configurações...');
    
    // 🎯 LOG DE DEBUG - VER O QUE ESTÁ SENDO SALVO
    console.log('🔍 [DEBUG DaySettingsCard] Dados a serem salvos:', {
      mesAno,
      dia: day.dia,
      horarios,
      observacao,
      statusGeral: getStatusGeral()
    });
    
    try {
      // Prepara os dados atualizados
      const updates = {
        horarios: horarios,
        observacao: observacao,
        status: getStatusGeral(),
        lastUpdated: new Date().toISOString()
      };

      // 🔄 SINCRONIZAÇÃO COM O SISTEMA
      const diaIndex = parseInt(day.dia) - 1;
      console.log('🔍 [DEBUG] Chamando updateDayAndSync...', { diaIndex, updates });
      
      const result = await updateDayAndSync(diaIndex, updates);
      
      console.log('🔍 [DEBUG] Resultado do updateDayAndSync:', result);
      
      if (result.success) {
        // 🎯 SALVAR CONFIGURAÇÃO NO FIREBASE PARA SINCRONIZAÇÃO
        console.log('🔍 [DEBUG] Chamando saveDayConfigToFirebase...', { 
          mesAno, 
          dia: parseInt(day.dia), 
          updates 
        });
        
        const firebaseResult = await saveDayConfigToFirebase(mesAno, parseInt(day.dia), updates);
        
        console.log('🔍 [DEBUG] Resultado do saveDayConfigToFirebase:', firebaseResult);
        
        setSyncStatus('Configurações salvas e sincronizadas ✅');
        setIsEditing(false);
        
        if (onUpdateDay) {
          onUpdateDay(day.dia, updates);
        }
        
        // 🎯 FEEDBACK VISUAL
        setTimeout(() => setSyncStatus(''), 3000);
      } else {
        console.error('❌ [DEBUG] updateDayAndSync falhou:', result);
        setSyncStatus('Erro na sincronização ❌');
      }
    } catch (error) {
      console.error('❌ [DEBUG] Erro ao salvar:', error);
      setSyncStatus('Erro ao salvar configurações ❌');
      alert('Erro ao salvar horários: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('🔍 [DEBUG] Cancelando edição');
    setHorarios(day.horarios || {});
    setObservacao(day.observacao || '');
    setIsEditing(false);
    setSyncStatus('');
  };

  // 🆕 SINCRONIZAÇÃO MANUAL
  const handleForceSync = async () => {
    console.log('🔍 [DEBUG] Forçando sincronização manual');
    await loadRealBookingData();
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
          <div className="space-y-1 mb-2 max-h-20 overflow-y-auto">
            {Object.entries(horarios).map(([horarioKey, horario]) => {
              const statusInfo = statusOptions.find(opt => opt.value === horario.status);
              
              return (
                <div key={horarioKey} className="flex justify-between items-center text-xs">
                  <span className="font-medium">{horarioKey}</span>
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

          {/* 🆕 DEBUG INFO */}
          <div className="mt-1 text-xs text-gray-400">
            ID: {mesAno}-{day.dia}
          </div>
        </div>
      ) : (
        // MODO EDIÇÃO DE HORÁRIOS CUSTOMIZÁVEIS
        <div className="space-y-3">
          <div className="font-bold text-center text-lg">Dia {day.dia}</div>

          {/* 🆕 STATUS DE SINCRONIZAÇÃO */}
          <div className={`text-xs text-center p-1 rounded ${
            syncStatus.includes('✅') ? 'bg-green-100 text-green-700' :
            syncStatus.includes('❌') ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {syncStatus || 'Editando horários...'}
          </div>

          {/* Lista de horários editáveis */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-700">
                Horários Customizáveis:
              </label>
              <button
                onClick={handleForceSync}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                title="Sincronizar com agendamentos reais"
              >
                🔄 Sincronizar
              </button>
            </div>
            
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
                    title="Remover horário"
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
                      value={horario.lotacaoAtual}
                      onChange={(e) => handleHorarioChange(horarioKey, 'lotacaoAtual', parseInt(e.target.value) || 0)}
                      className="w-full border rounded px-1"
                      min="0"
                      max={horario.lotacaoMaxima}
                    />
                  </div>
                  <div>
                    <label>Ocupadas:</label>
                    <input
                      type="number"
                      value={horario.lotacaoAtual}
                      onChange={(e) => handleHorarioChange(horarioKey, 'lotacaoAtual', parseInt(e.target.value) || 0)}
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

          {/* 🆕 DEBUG INFO */}
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div className="font-semibold">🔍 Debug Info:</div>
            <div>ID Firebase: {mesAno}-{day.dia}</div>
            <div>Horários: {Object.keys(horarios).length}</div>
            <div>Status: {statusGeral}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySettingsCard;