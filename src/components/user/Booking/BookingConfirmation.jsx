// src/components/user/Booking/BookingForm.jsx
import React, { useState } from 'react';

const BookingForm = ({ selectedDay, mesAno, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    numeroVisitantes: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookingData = {
      ...formData,
      dia: selectedDay.dia,
      mesAno: mesAno,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    onSubmit(bookingData);
  };

  const [mes, ano] = mesAno.split('-').map(Number);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Fazer Agendamento
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Informações do Dia Selecionado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Data Selecionada</h3>
        <p className="text-blue-700">
          📅 {selectedDay.dia} de {mes}/{ano} - {selectedDay.diaDaSemana}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite seu nome completo"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(21) 99999-9999"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Visitantes *
          </label>
          <select
            name="numeroVisitantes"
            value={formData.numeroVisitantes}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'pessoa' : 'pessoas'}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            * Grupos maiores devem entrar em contato diretamente com o museu
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Chegue com 15 minutos de antecedência</li>
            <li>• Apresente documento com foto na entrada</li>
            <li>• Use máscara (recomendado)</li>
            <li>• Respeite as normas do museu</li>
          </ul>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;