// src/components/admin/Management/CalendarSettings/AdminCalendarSettings.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DayCard from './DaySettingsCard'; // ✅ Componente de configuração
import { useCalendarSyncManager } from '../../../../core/managers/CalendarSyncManager';
import { updateDay } from '../../../../store/slices/agendaSlice';

const AdminCalendarSettings = ({ agenda, onSave, mesAno }) => {
  const dispatch = useDispatch();
  const { updateDayAndSync } = useCalendarSyncManager();
  
  const [diasEditados, setDiasEditados] = useState([]);
  const [modificacoes, setModificacoes] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Sincroniza com a agenda do Redux
  useEffect(() => {
    setDiasEditados(agenda.dias || []);
    setModificacoes(false);
  }, [agenda]);

  /**
   * Atualiza status do dia E sincroniza imediatamente
   */
  const handleStatusChange = async (diaIndex, novoStatus) => {
    try {
      const diaOriginal = agenda.dias[diaIndex];
      
      // Atualização otimista na UI
      const novosDias = [...diasEditados];
      novosDias[diaIndex] = {
        ...novosDias[diaIndex],
        status: novoStatus,
        // Mantém observação ou define uma padrão
        observacao: novoStatus === 'indisponivel' 
          ? 'Dia indisponível' 
          : novosDias[diaIndex].observacao
      };
      setDiasEditados(novosDias);
      setModificacoes(true);

      // 🔄 SINCRONIZAÇÃO EM TEMPO REAL
      const result = await updateDayAndSync(diaIndex, {
        status: novoStatus,
        disponivel: novoStatus === 'disponivel',
        observacao: novoStatus === 'indisponivel' ? 'Dia indisponível' : diaOriginal.observacao
      });

      if (!result.success) {
        // Reverte se falhar
        console.error('❌ Falha ao sincronizar:', result.error);
        setDiasEditados(agenda.dias || []);
      }

    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      // Reverte para o estado original
      setDiasEditados(agenda.dias || []);
    }
  };

  /**
   * Atualiza observação do dia
   */
  const handleObservacaoChange = async (diaIndex, observacao) => {
    try {
      // Atualização otimista
      const novosDias = [...diasEditados];
      novosDias[diaIndex] = {
        ...novosDias[diaIndex],
        observacao: observacao
      };
      setDiasEditados(novosDias);
      setModificacoes(true);

      // 🔄 SINCRONIZAÇÃO
      await updateDayAndSync(diaIndex, { observacao });

    } catch (error) {
      console.error('❌ Erro ao atualizar observação:', error);
      setDiasEditados(agenda.dias || []);
    }
  };

  /**
   * Salva todas as modificações pendentes
   */
  const handleSave = async () => {
    if (!modificacoes) return;
    
    setSalvando(true);
    try {
      // 🔄 SINCRONIZA TODAS AS ALTERAÇÕES
      for (let i = 0; i < diasEditados.length; i++) {
        const diaEditado = diasEditados[i];
        const diaOriginal = agenda.dias[i];
        
        // Verifica se houve mudança
        if (JSON.stringify(diaEditado) !== JSON.stringify(diaOriginal)) {
          await updateDayAndSync(i, {
            status: diaEditado.status,
            disponivel: diaEditado.status === 'disponivel',
            observacao: diaEditado.observacao || ''
          });
        }
      }

      // Chama callback de sucesso
      if (onSave) {
        onSave({ dias: diasEditados });
      }
      
      setModificacoes(false);
      alert('✅ Alterações salvas e sincronizadas!');

    } catch (error) {
      console.error('❌ Erro ao salvar alterações:', error);
      alert('❌ Erro ao salvar alterações');
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Reverte todas as alterações
   */
  const handleCancel = () => {
    setDiasEditados(agenda.dias || []);
    setModificacoes(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurar Agenda - {mesAno}</h2>
          <p className="text-gray-600">
            Modificações são salvas automaticamente no calendário principal
            {modificacoes && ' • Alterações não sincronizadas'}
          </p>
        </div>
        <div className="flex gap-3">
          {modificacoes && (
            <>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                ⚠️ Alterações pendentes
              </span>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                ↩️ Cancelar
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={!modificacoes || salvando}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              modificacoes && !salvando
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : salvando
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {salvando ? '🔄 Salvando...' : '💾 Salvar Tudo'}
          </button>
        </div>
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
        {diasEditados.map((dia, index) => (
          <DayCard
            key={dia.dia}
            dia={dia}
            index={index}
            onStatusChange={handleStatusChange}
            onObservacaoChange={handleObservacaoChange}
            isSynced={!modificacoes} // Indica se está sincronizado
          />
        ))}
      </div>

      {/* Estatísticas */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Resumo do Mês:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-green-600 font-bold text-lg">
              {diasEditados.filter(d => d.status === 'disponivel').length}
            </div>
            <div className="text-green-700">Disponíveis</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="text-red-600 font-bold text-lg">
              {diasEditados.filter(d => d.status === 'lotado').length}
            </div>
            <div className="text-red-700">Lotados</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-gray-600 font-bold text-lg">
              {diasEditados.filter(d => d.status === 'fechado').length}
            </div>
            <div className="text-gray-600">Fechados</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-yellow-600 font-bold text-lg">
              {diasEditados.filter(d => d.status === 'indisponivel').length}
            </div>
            <div className="text-yellow-700">Indisponíveis</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendarSettings;