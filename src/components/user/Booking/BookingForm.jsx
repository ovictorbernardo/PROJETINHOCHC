// src/components/user/Booking/BookingForm.jsx
import React, { useState } from 'react';
// 🆕 ADICIONADO: Import do InfoMessage
import InfoMessage from '../../ui/InfoMessage';

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
    
    // 🆕 MELHORADO: Validação básica
    if (!formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

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
          className="text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Fechar formulário"
        >
          ✕
        </button>
      </div>

      {/* 🆕 MELHORADO: InfoMessage em vez de div simples */}
      <div className="mb-6">
        <InfoMessage 
          title="Data Selecionada"
          message={`${selectedDay.dia} de ${mes}/${ano} - ${selectedDay.diaDaSemana}`}
          icon="📅"
        />
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Digite seu nome completo"
            disabled={loading}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="seu@email.com"
              disabled={loading}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="(21) 99999-9999"
              disabled={loading}
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'pessoa' : 'pessoas'}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            * Grupos maiores devem entrar em contato diretamente com o Centro Histórico e Cultural do CBMERJ (CHC) 
          </p>
        </div>

        {/* 🆕 MELHORADO: InfoMessage para avisos importantes */}
        <InfoMessage 
          title="Informações Importantes"
          message="Chegue com 15 minutos de antecedência, apresente documento com foto na entrada e respeite o código de vestimenta compatiível ao ambiente militar."
          icon="⚠️"
        />

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Agendando...
              </>
            ) : (
              'Confirmar Agendamento'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;