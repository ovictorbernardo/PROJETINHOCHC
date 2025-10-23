import React, { useState } from 'react';

const BookingForm = ({ selectedDay, mesAno, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    adultos: 1,
    criancas: 0,
    telefone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookingData = {
      ...formData,
      dia: selectedDay.dia,
      mesAno: mesAno,
      horario: selectedDay.horarios?.[0] || '10:00'
    };
    
    onSubmit(bookingData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!selectedDay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-90vh overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Agendamento para dia {selectedDay.dia}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(21) 99999-9999"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adultos
                </label>
                <select
                  name="adultos"
                  value={formData.adultos}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num} adulto(s)</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crianças
                </label>
                <select
                  name="criancas"
                  value={formData.criancas}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[0,1,2,3,4].map(num => (
                    <option key={num} value={num}>{num} criança(s)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;