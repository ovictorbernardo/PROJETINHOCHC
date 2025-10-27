// src/components/test/TestHorariosButton.jsx
import React from 'react';
import { testNovaEstruturaHorarios, testAtualizacaoHorario } from '../../utils/testHorarioStructure';

const TestHorariosButton = () => {
  const handleTestEstrutura = () => {
    console.clear();
    console.log('🧪 Iniciando teste de estrutura de horários...');
    testNovaEstruturaHorarios();
  };

  const handleTestAtualizacao = () => {
    console.clear();
    console.log('🧪 Iniciando teste de atualização...');
    testAtualizacaoHorario();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#3B82F6',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      zIndex: 10000,
      fontSize: '12px',
      border: '2px solid #1D4ED8'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🧪 Testes</h4>
      
      <button 
        onClick={handleTestEstrutura}
        style={{
          background: '#10B981',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '2px',
          fontSize: '11px'
        }}
      >
        Testar Estrutura
      </button>
      
      <button 
        onClick={handleTestAtualizacao}
        style={{
          background: '#8B5CF6',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '2px',
          fontSize: '11px'
        }}
      >
        Testar Atualização
      </button>
    </div>
  );
};

export default TestHorariosButton;