// src/components/views/UserBookingsView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import InfoMessage from '../ui/InfoMessage';
import './UserBookingsView.css';

const UserBookingsView = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // 🎯 BUSCAR AGENDAMENTOS DO REDUX STORE
  const allBookings = useSelector(state => state.booking?.items || []);
  
  // 🎯 FILTRAR AGENDAMENTOS DO USUÁRIO COM USEMEMO
  const userBookings = useMemo(() => {
    if (!user || !allBookings.length) return [];
    
    const userEmail = user.email?.toLowerCase();
    if (!userEmail) return [];
    
    return allBookings.filter(booking => {
      return booking.adultos?.some(adulto => 
        adulto.email?.toLowerCase() === userEmail
      );
    });
  }, [user, allBookings]);

  // 🎯 EFFECT SIMPLIFICADO
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 🎯 FORMATAR DATA
  const formatDate = (dia, mesAno) => {
    if (!dia || !mesAno) return 'Data não informada';
    
    try {
      const [mes, ano] = mesAno.split('-');
      return `${dia.toString().padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    } catch (error) {
      return 'Data inválida';
    }
  };

  // 🎯 BADGE DE STATUS
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: '⏳' },
      'confirmado': { label: 'Confirmado', color: 'bg-green-100 text-green-800 border border-green-200', icon: '✅' },
      'cancelado': { label: 'Cancelado', color: 'bg-red-100 text-red-800 border border-red-200', icon: '❌' },
      'concluido': { label: 'Concluído', color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: '🎉' }
    };
    
    const config = statusConfig[status] || statusConfig.pendente;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <span className="mr-2 text-base">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // 🎯 RENDERIZAÇÃO CONDICIONAL
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner text="Carregando seus agendamentos..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <InfoMessage 
          title="Acesso necessário"
          message="Você precisa estar logado para visualizar seus agendamentos."
          icon="🔐"
          type="warning"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Agendamentos</h1>
          <p className="text-lg text-gray-600">
            Gerencie todas as suas visitas agendadas ao Quartel Central
          </p>
        </div>

        {/* Lista de Agendamentos */}
        {userBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Você ainda não possui agendamentos. Faça seu primeiro agendamento para visitar o Quartel Central.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📅 Fazer Primeiro Agendamento
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking, index) => (
              <div 
                key={booking.id || `booking-${index}`} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Cabeçalho do Card */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        Visita ao Quartel Central
                      </h3>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>
                          {formatDate(booking.data?.dia, booking.data?.mesAno)} às {booking.data?.horario || 'Horário não informado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Detalhes do Agendamento */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Participantes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">👥</span>
                        Participantes
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-700">
                            <strong>{booking.adultos?.length || 0}</strong> adulto(s)
                          </span>
                          {booking.criancas?.length > 0 && (
                            <span className="text-gray-700">
                              <strong>{booking.criancas?.length || 0}</strong> criança(s)
                            </span>
                          )}
                        </div>
                        
                        {/* Lista de Adultos */}
                        {booking.adultos?.map((adulto, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-gray-900">
                                {adulto.nome || 'Nome não informado'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>📧 {adulto.email || 'Email não informado'}</div>
                              {adulto.telefone && (
                                <div>📞 {adulto.telefone}</div>
                              )}
                              {adulto.cpf && (
                                <div>🆔 {adulto.cpf}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Informações Adicionais e Metadados */}
                    <div className="space-y-4">
                      {/* Informações Adicionais */}
                      {booking.informacoesAdicionais && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <span className="mr-2">📝</span>
                            Informações Adicionais
                          </h4>
                          <p className="text-gray-700 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm">
                            {booking.informacoesAdicionais}
                          </p>
                        </div>
                      )}

                      {/* Metadados */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">📋</span>
                          Detalhes do Agendamento
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Criado em:</span>
                            <span className="text-gray-900 font-medium">
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                            </span>
                          </div>
                          {booking.id && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Código:</span>
                              <span className="text-gray-900 font-mono font-medium">
                                {booking.id.substring(0, 12)}...
                              </span>
                            </div>
                          )}
                          {booking.totalPessoas && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total de pessoas:</span>
                              <span className="text-gray-900 font-medium">
                                {booking.totalPessoas}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(UserBookingsView);