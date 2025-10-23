import React from 'react';

const UserBookings = ({ mesAno }) => {
  // Mock data para demonstração
  const mockUserBookings = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com', 
      telefone: '(21) 99999-9999',
      adultos: 2,
      criancas: 1,
      dia: 15,
      mesAno: '10-2025',
      horario: '14:00',
      status: 'confirmado',
      createdAt: '2024-01-20T10:00:00Z'
    }
  ];

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meus Agendamentos</h2>
        <div className="text-sm text-gray-600">
          {mockUserBookings.length} agendamento(s) encontrado(s)
        </div>
      </div>

      {mockUserBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-gray-600">
            Você ainda não fez nenhum agendamento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockUserBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Agendamento para dia {booking.dia}</h3>
                  <p className="text-gray-600">Horário: {booking.horario}</p>
                </div>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <div><strong>Nome:</strong> {booking.nome}</div>
                  <div><strong>Email:</strong> {booking.email}</div>
                  <div><strong>Telefone:</strong> {booking.telefone}</div>
                </div>
                <div>
                  <div><strong>Pessoas:</strong> {booking.adultos} adulto(s), {booking.criancas} criança(s)</div>
                  <div><strong>Status:</strong> {getStatusText(booking.status)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;