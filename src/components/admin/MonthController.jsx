import React from 'react';
import { useDispatch } from 'react-redux';
import { setMesDisponivel } from '../../store/slices/agendaSlice';
import { getNomeMes } from '../../utils/initialData';

const MonthController = ({ mesAno, mesDisponivel, onToggleDisponibilidade }) => {
  const dispatch = useDispatch();
  
  const [mes, ano] = mesAno.split('-').map(Number);
  const nomeMes = getNomeMes(mes);
  
  const [loading, setLoading] = React.useState(false);

  const handleToggleDisponibilidade = async (liberar) => {
    setLoading(true);
    try {
      dispatch(setMesDisponivel({ 
        mesAno, 
        disponivel: liberar 
      }));
      
      // Chama callback do parent se fornecido
      if (onToggleDisponibilidade) {
        onToggleDisponibilidade(liberar);
      }
      
      if (liberar) {
        alert(`✅ Mês de ${nomeMes} liberado para agendamentos!`);
      } else {
        alert(`⏸️ Mês de ${nomeMes} bloqueado para novos agendamentos!`);
      }
    } catch (error) {
      alert('❌ Erro ao alterar disponibilidade do mês: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (mesDisponivel) {
      return {
        text: 'Mês Liberado',
        description: 'Agendamentos estão abertos para este mês',
        color: 'green',
        buttonText: '⏸️ Bloquear Mês',
        buttonColor: 'yellow'
      };
    } else {
      return {
        text: 'Mês Bloqueado',
        description: 'Agendamentos fechados para este mês',
        color: 'red', 
        buttonText: '✅ Liberar Mês',
        buttonColor: 'green'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Controle de Disponibilidade - {nomeMes} de {ano}
          </h3>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
            statusInfo.color === 'green' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              statusInfo.color === 'green' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {statusInfo.text}
          </div>
          
          <p className="text-sm text-gray-600">
            {statusInfo.description}
          </p>
          
          {mesDisponivel && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                💡 <strong>Dica:</strong> Os dias serão automaticamente configurados como disponíveis, 
                mantendo domingos e feriados como fechados.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-3">
          <button
            onClick={() => handleToggleDisponibilidade(!mesDisponivel)}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              statusInfo.buttonColor === 'green' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-yellow-600 hover:bg-yellow-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? '⏳ Processando...' : statusInfo.buttonText}
          </button>
          
          <div className="text-xs text-gray-500 text-center">
            {mesDisponivel 
              ? '📋 Visitantes podem agendar' 
              : '🔒 Agendamentos bloqueados'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthController;