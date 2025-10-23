import React, { useState, useEffect } from 'react';
import DayCard from './DayCard'; // ✅ Já está correto (mesma pasta)

const AdminCalendarSettings = ({ agenda, onSave, mesAno }) => {
  const [diasEditados, setDiasEditados] = useState([]);
  const [modificacoes, setModificacoes] = useState(false);

  useEffect(() => {
    setDiasEditados(agenda.dias || []);
  }, [agenda]);

  const handleStatusChange = (diaIndex, novoStatus) => {
    const novosDias = [...diasEditados];
    novosDias[diaIndex] = {
      ...novosDias[diaIndex],
      status: novoStatus
    };
    setDiasEditados(novosDias);
    setModificacoes(true);
  };

  const handleObservacaoChange = (diaIndex, observacao) => {
    const novosDias = [...diasEditados];
    novosDias[diaIndex] = {
      ...novosDias[diaIndex],
      observacao: observacao
    };
    setDiasEditados(novosDias);
    setModificacoes(true);
  };

  const handleSave = () => {
    onSave({ dias: diasEditados });
    setModificacoes(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurar Agenda - {mesAno}</h2>
          <p className="text-gray-600">Modifique o status e observações de cada dia</p>
        </div>
        <div className="flex gap-3">
          {modificacoes && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              ⚠️ Alterações não salvas
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!modificacoes}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              modificacoes 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            💾 Salvar Alterações
          </button>
        </div>
      </div>

      {/* Grid de dias usando componente DayCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
        {diasEditados.map((dia, index) => (
          <DayCard
            key={dia.dia}
            dia={dia}
            index={index}
            onStatusChange={handleStatusChange}
            onObservacaoChange={handleObservacaoChange}
          />
        ))}
      </div>

      {/* Estatísticas */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Resumo do Mês:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-green-600 font-bold">
              {diasEditados.filter(d => d.status === 'disponivel').length}
            </div>
            <div className="text-gray-600">Disponíveis</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-bold">
              {diasEditados.filter(d => d.status === 'lotado').length}
            </div>
            <div className="text-gray-600">Lotados</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-bold">
              {diasEditados.filter(d => d.status === 'fechado').length}
            </div>
            <div className="text-gray-600">Fechados</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-600 font-bold">
              {diasEditados.filter(d => d.status === 'indisponivel').length}
            </div>
            <div className="text-gray-600">Indisponíveis</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendarSettings;