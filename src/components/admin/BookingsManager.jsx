import React, { useState } from 'react';

const BookingsManager = ({ bookings, onStatusUpdate, mesAno }) => {
  const [filterStatus, setFilterStatus] = useState('todos');

  const filteredBookings = bookings.filter(booking => 
    filterStatus === 'todos' || booking.status === filterStatus
  );

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmado: 'bg-green-100 text-green-800 border-green-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      cancelado: 'Cancelado'
    };
    return texts[status] || status;
  };

  const handleStatusChange = async (bookingId, novoStatus) => {
    if (window.confirm(`Tem certeza que deseja marcar como ${getStatusText(novoStatus)}?`)) {
      await onStatusUpdate(bookingId, novoStatus);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Reservas</h2>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Filtrar:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-lg">Nenhuma reserva encontrada</p>
          <p className="text-sm mt-2">
            {filterStatus !== 'todos' 
              ? `Não há reservas com status "${getStatusText(filterStatus)}"`
              : 'Não há reservas para o período selecionado'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
              <div className="text-sm text-blue-800">Total de Reservas</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pendente').length}
              </div>
              <div className="text-sm text-yellow-800">Pendentes</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmado').length}
              </div>
              <div className="text-sm text-green-800">Confirmadas</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              <div className="col-span-3">Visitante</div>
              <div className="col-span-2">Data/Horário</div>
              <div className="col-span-2">Pessoas</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Ações</div>
            </div>

            {filteredBookings.map((booking) => (
              <div key={booking.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                {/* Informações do Visitante */}
                <div className="col-span-3">
                  <div className="font-medium text-gray-900">{booking.nome}</div>
                  <div className="text-sm text-gray-600">{booking.email}</div>
                  <div className="text-sm text-gray-600">{booking.telefone}</div>
                </div>

                {/* Data e Horário */}
                <div className="col-span-2">
                  <div className="font-medium">
                    Dia {booking.dia} de {mesAno}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking.horario}
                  </div>
                </div>

                {/* Quantidade de Pessoas */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👤 {booking.adultos} adulto(s)</span>
                  </div>
                  {booking.criancas > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">🧒 {booking.criancas} criança(s)</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(booking.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Ações */}
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-2">
                    {booking.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmado')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          title="Confirmar esta reserva"
                        >
                          ✅ Confirmar
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelado')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          title="Cancelar esta reserva"
                        >
                          ❌ Cancelar
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmado' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'cancelado')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        title="Cancelar esta reserva"
                      >
                        ❌ Cancelar
                      </button>
                    )}
                    
                    {booking.status === 'cancelado' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'confirmado')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        title="Reativar esta reserva"
                      >
                        🔄 Reativar
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        const bookingInfo = `
Nome: ${booking.nome}
Email: ${booking.email}
Telefone: ${booking.telefone}
Data: Dia ${booking.dia} de ${mesAno} às ${booking.horario}
Pessoas: ${booking.adultos} adulto(s), ${booking.criancas} criança(s)
Status: ${getStatusText(booking.status)}
Criado em: ${new Date(booking.createdAt).toLocaleString('pt-BR')}
                        `.trim();
                        alert(bookingInfo);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      title="Ver detalhes completos"
                    >
                      📋 Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;