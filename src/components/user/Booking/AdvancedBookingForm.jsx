// src/components/user/Booking/AdvancedBookingForm.jsx
import React, { useState, useEffect } from 'react';
import InfoMessage from '../../ui/InfoMessage';
import { adultTemplate, childTemplate, validateCPF, validateEmail, calculateAge } from '../../../utils/bookingTypes';
import { checkAvailability, BookingService } from '../../../services/bookingService';
import { useSyncManager } from '../../../hooks/useSyncManager';

const AdvancedBookingForm = ({ selectedDay, mesAno, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    adultos: [{ ...adultTemplate }],
    criancas: [],
    informacoesAdicionais: '',
    data: {
      dia: selectedDay.dia,
      mesAno: mesAno,
      horario: '10:00'
    }
  });

  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState({
    loading: true,
    available: true,
    currentCount: 0,
    maxLimit: 30
  });

  const [dayConfig, setDayConfig] = useState({
    maxAdultos: 5,
    maxCriancas: 20,
    horarios: {}
  });

  // 🎯 USAR HOOK DE SINCRONIZAÇÃO
  const { syncStatus } = useSyncManager(mesAno, new Date(selectedDay.ano, selectedDay.mes - 1, selectedDay.dia));

  // 🎯 CARREGAR CONFIGURAÇÃO DO DIA
  useEffect(() => {
    loadDayConfig();
  }, [selectedDay.dia, mesAno]);

  // 🎯 OUVIR ATUALIZAÇÕES EM TEMPO REAL
  useEffect(() => {
    const handleDayConfigUpdate = (event) => {
      if (event.detail.mesAno === mesAno && event.detail.dayNumber === selectedDay.dia) {
        setDayConfig(event.detail.config);
        checkTimeAvailability(); // Re-verificar disponibilidade
      }
    };

    window.addEventListener('dayConfigUpdated', handleDayConfigUpdate);
    return () => window.removeEventListener('dayConfigUpdated', handleDayConfigUpdate);
  }, [mesAno, selectedDay.dia]);

  const loadDayConfig = async () => {
    try {
      const config = await BookingService.getDayConfig(mesAno, selectedDay.dia);
      setDayConfig(config);
      
      // 🎯 VERIFICAR SE O HORÁRIO SELECIONADO AINDA ESTÁ DISPONÍVEL
      const horarioConfig = config.horarios?.[formData.data.horario];
      if (!horarioConfig?.disponivel) {
        // 🎯 ENCONTRAR PRIMEIRO HORÁRIO DISPONÍVEL
        const availableTime = Object.keys(config.horarios || {}).find(
          time => config.horarios[time]?.disponivel
        );
        
        if (availableTime) {
          setFormData(prev => ({
            ...prev,
            data: { ...prev.data, horario: availableTime }
          }));
        }
      }
      
      checkTimeAvailability();
    } catch (error) {
      console.error('Erro ao carregar configuração do dia:', error);
      checkTimeAvailability();
    }
  };

  // 🎯 VERIFICAR DISPONIBILIDADE DO HORÁRIO
  const checkTimeAvailability = async () => {
    setAvailability(prev => ({ ...prev, loading: true }));
    
    try {
      const dateString = `${selectedDay.dia.toString().padStart(2, '0')}/${mesAno}`;
      const result = await checkAvailability(dateString, formData.data.horario);
      
      // 🎯 OBTER LIMITE MÁXIMO DA CONFIGURAÇÃO DO DIA
      const horarioConfig = dayConfig.horarios?.[formData.data.horario];
      const maxLimit = horarioConfig?.maxPessoas || result.maxLimit || 30;
      
      setAvailability({
        loading: false,
        available: result.available && (horarioConfig?.disponivel !== false),
        currentCount: result.currentCount,
        maxLimit: maxLimit
      });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      setAvailability({
        loading: false,
        available: true,
        currentCount: 0,
        maxLimit: 30
      });
    }
  };

  // 🎯 ATUALIZAR HORÁRIO E VERIFICAR DISPONIBILIDADE
  const handleTimeChange = (newTime) => {
    setFormData({
      ...formData,
      data: { ...formData.data, horario: newTime }
    });
  };

  // 🎯 GERENCIAMENTO DE ADULTOS COM LIMITE DINÂMICO
  const addAdulto = () => {
    const maxAdultos = dayConfig.maxAdultos || 5;
    if (formData.adultos.length < maxAdultos) {
      setFormData({
        ...formData,
        adultos: [...formData.adultos, { ...adultTemplate }]
      });
    }
  };

  const removeAdulto = (index) => {
    if (formData.adultos.length > 1) {
      const novosAdultos = formData.adultos.filter((_, i) => i !== index);
      setFormData({ ...formData, adultos: novosAdultos });
    }
  };

  const updateAdulto = (index, field, value) => {
    const novosAdultos = [...formData.adultos];
    novosAdultos[index][field] = value;
    setFormData({ ...formData, adultos: novosAdultos });
  };

  // 🧒 GERENCIAMENTO DE CRIANÇAS COM LIMITE DINÂMICO
  const addCrianca = () => {
    const maxCriancas = dayConfig.maxCriancas || 20;
    if (formData.criancas.length < maxCriancas) {
      setFormData({
        ...formData,
        criancas: [...formData.criancas, { ...childTemplate }]
      });
    }
  };

  const removeCrianca = (index) => {
    const novasCriancas = formData.criancas.filter((_, i) => i !== index);
    setFormData({ ...formData, criancas: novasCriancas });
  };

  const updateCrianca = (index, field, value) => {
    const novasCriancas = [...formData.criancas];
    novasCriancas[index][field] = value;
    
    // Calcula idade automaticamente se data de nascimento for preenchida
    if (field === 'dataNascimento' && value) {
      const idade = calculateAge(value);
      novasCriancas[index].idade = idade.toString();
    }
    
    setFormData({ ...formData, criancas: novasCriancas });
  };

  // ✅ VALIDAÇÃO DO FORMULÁRIO ATUALIZADA
  const validateForm = () => {
    const newErrors = {};

    // Verificar disponibilidade primeiro
    if (!availability.available) {
      newErrors.availability = `Horário lotado! Já temos ${availability.currentCount} pessoas agendadas.`;
    }

    // Verificar se o total não excede o limite
    const totalPessoas = formData.adultos.length + formData.criancas.length;
    const vagasRestantes = availability.maxLimit - availability.currentCount;
    
    if (totalPessoas > vagasRestantes) {
      newErrors.capacity = `Você está tentando agendar ${totalPessoas} pessoas, mas só temos ${vagasRestantes} vagas restantes neste horário.`;
    }

    // 🎯 VERIFICAR LIMITES DINÂMICOS
    const maxAdultos = dayConfig.maxAdultos || 5;
    if (formData.adultos.length > maxAdultos) {
      newErrors.adultLimit = `Máximo de ${maxAdultos} adultos permitidos por agendamento.`;
    }

    const maxCriancas = dayConfig.maxCriancas || 20;
    if (formData.criancas.length > maxCriancas) {
      newErrors.childLimit = `Máximo de ${maxCriancas} crianças permitidas por agendamento.`;
    }

    // Valida adultos
    formData.adultos.forEach((adulto, index) => {
      if (!adulto.nome.trim()) {
        newErrors[`adulto_${index}_nome`] = 'Nome é obrigatório';
      }
      if (!validateCPF(adulto.cpf)) {
        newErrors[`adulto_${index}_cpf`] = 'CPF inválido';
      }
      if (!validateEmail(adulto.email)) {
        newErrors[`adulto_${index}_email`] = 'Email inválido';
      }
      if (!adulto.telefone.trim()) {
        newErrors[`adulto_${index}_telefone`] = 'Telefone é obrigatório';
      }
    });

    // Valida crianças
    formData.criancas.forEach((crianca, index) => {
      if (!crianca.nomeCompleto.trim()) {
        newErrors[`crianca_${index}_nome`] = 'Nome completo é obrigatório';
      }
      if (crianca.dataNascimento && !crianca.idade) {
        newErrors[`crianca_${index}_idade`] = 'Idade é obrigatória';
      }
      if (!crianca.nomeResponsavel.trim()) {
        newErrors[`crianca_${index}_responsavel`] = 'Nome do responsável é obrigatório';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 ENVIO DO FORMULÁRIO
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookingData = {
        ...formData,
        status: 'pendente',
        createdAt: new Date().toISOString(),
        totalPessoas: formData.adultos.length + formData.criancas.length,
        dayConfig: dayConfig // 🎯 INCLUIR CONFIGURAÇÃO DO DIA PARA AUDITORIA
      };
      
      onSubmit(bookingData);
    }
  };

  const [mes, ano] = mesAno.split('-').map(Number);
  const totalPessoas = formData.adultos.length + formData.criancas.length;
  const vagasRestantes = availability.maxLimit - availability.currentCount;
  
  // 🎯 OBTER HORÁRIOS DISPONÍVEIS DA CONFIGURAÇÃO DO DIA
  const availableTimes = Object.keys(dayConfig.horarios || {})
    .filter(time => dayConfig.horarios[time]?.disponivel !== false)
    .sort();

  const maxAdultos = dayConfig.maxAdultos || 5;
  const maxCriancas = dayConfig.maxCriancas || 20;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Agendamento de Visita - Quartel Central
        </h2>
        <div className="flex items-center space-x-2">
          {syncStatus === 'updated' && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              ✓ Atualizado
            </span>
          )}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Fechar formulário"
          >
            ✕
          </button>
        </div>
      </div>

      <InfoMessage 
        title="Data da Visita"
        message={`${selectedDay.dia} de ${mes}/${ano} - ${selectedDay.diaDaSemana}`}
        icon="📅"
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* 📅 HORÁRIO DA VISITA COM DISPONIBILIDADE DINÂMICA */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-blue-800">Horário da Visita</h3>
            {!availability.loading && (
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                availability.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {availability.available ? 
                  `${vagasRestantes} vagas restantes` : 
                  'LOTADO'
                }
              </span>
            )}
          </div>
          
          {availableTimes.length > 0 ? (
            <select
              value={formData.data.horario}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
              disabled={loading}
            >
              {availableTimes.map(time => (
                <option key={time} value={time}>
                  {time} - {time === '10:00' ? 'Manhã' : time === '14:00' ? 'Tarde' : 'Tarde'}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
              Nenhum horário disponível para esta data.
            </div>
          )}

          {/* STATUS DE DISPONIBILIDADE */}
          {availability.loading ? (
            <div className="flex items-center text-blue-600 text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              Verificando disponibilidade...
            </div>
          ) : (
            <div className={`text-sm ${
              availability.available ? 'text-green-600' : 'text-red-600'
            }`}>
              {availability.available ? (
                <span>✅ Disponível - {availability.currentCount}/{availability.maxLimit} pessoas agendadas</span>
              ) : (
                <span>❌ Lotado - {availability.currentCount}/{availability.maxLimit} pessoas agendadas</span>
              )}
            </div>
          )}

          {/* ERRO DE DISPONIBILIDADE */}
          {errors.availability && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.availability}
            </div>
          )}

          {/* ERRO DE CAPACIDADE */}
          {errors.capacity && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.capacity}
            </div>
          )}
        </div>

        {/* 👥 SEÇÃO DE ADULTOS COM LIMITE DINÂMICO */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Adultos ({formData.adultos.length}/{maxAdultos})
            </h3>
            {formData.adultos.length < maxAdultos && (
              <button
                type="button"
                onClick={addAdulto}
                disabled={!availability.available || loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
              >
                + Adicionar Adulto
              </button>
            )}
          </div>

          {errors.adultLimit && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.adultLimit}
            </div>
          )}

          {formData.adultos.map((adulto, index) => (
            <div key={index} className="border-b pb-4 mb-4 last:border-b-0 last:mb-0">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Adulto {index + 1}</h4>
                {formData.adultos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAdulto(index)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={adulto.nome}
                    onChange={(e) => updateAdulto(index, 'nome', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[`adulto_${index}_nome`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome completo"
                    disabled={loading || !availability.available}
                  />
                  {errors[`adulto_${index}_nome`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`adulto_${index}_nome`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={adulto.cpf}
                    onChange={(e) => updateAdulto(index, 'cpf', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[`adulto_${index}_cpf`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                    disabled={loading || !availability.available}
                  />
                  {errors[`adulto_${index}_cpf`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`adulto_${index}_cpf`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={adulto.email}
                    onChange={(e) => updateAdulto(index, 'email', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[`adulto_${index}_email`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                    disabled={loading || !availability.available}
                  />
                  {errors[`adulto_${index}_email`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`adulto_${index}_email`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={adulto.telefone}
                    onChange={(e) => updateAdulto(index, 'telefone', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[`adulto_${index}_telefone`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(21) 99999-9999"
                    disabled={loading || !availability.available}
                  />
                  {errors[`adulto_${index}_telefone`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`adulto_${index}_telefone`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🧒 SEÇÃO DE CRIANÇAS COM LIMITE DINÂMICO */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Crianças ({formData.criancas.length}/{maxCriancas})
            </h3>
            {formData.criancas.length < maxCriancas && (
              <button
                type="button"
                onClick={addCrianca}
                disabled={!availability.available || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
              >
                + Adicionar Criança
              </button>
            )}
          </div>

          {errors.childLimit && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.childLimit}
            </div>
          )}

          {formData.criancas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma criança adicionada. Clique no botão acima para adicionar.
            </p>
          ) : (
            formData.criancas.map((crianca, index) => (
              <div key={index} className="border-b pb-4 mb-4 last:border-b-0 last:mb-0 bg-orange-50 p-4 rounded">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Criança {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCrianca(index)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm"
                  >
                    Remover
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome Completo da Criança */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo da Criança *
                    </label>
                    <input
                      type="text"
                      value={crianca.nomeCompleto}
                      onChange={(e) => updateCrianca(index, 'nomeCompleto', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors[`crianca_${index}_nome`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nome completo oficial da criança"
                      disabled={loading || !availability.available}
                    />
                    {errors[`crianca_${index}_nome`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`crianca_${index}_nome`]}</p>
                    )}
                  </div>

                  {/* Data de Nascimento e Idade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={crianca.dataNascimento}
                      onChange={(e) => updateCrianca(index, 'dataNascimento', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading || !availability.available}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idade *
                    </label>
                    <input
                      type="number"
                      value={crianca.idade}
                      onChange={(e) => updateCrianca(index, 'idade', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors[`crianca_${index}_idade`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Idade em anos"
                      min="0"
                      max="17"
                      disabled={loading || !availability.available}
                    />
                    {errors[`crianca_${index}_idade`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`crianca_${index}_idade`]}</p>
                    )}
                  </div>

                  {/* Responsável */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Responsável *
                    </label>
                    <input
                      type="text"
                      value={crianca.nomeResponsavel}
                      onChange={(e) => updateCrianca(index, 'nomeResponsavel', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors[`crianca_${index}_responsavel`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nome do responsável legal"
                      disabled={loading || !availability.available}
                    />
                    {errors[`crianca_${index}_responsavel`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`crianca_${index}_responsavel`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento do Responsável
                    </label>
                    <input
                      type="text"
                      value={crianca.documentoResponsavel}
                      onChange={(e) => updateCrianca(index, 'documentoResponsavel', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="RG ou CPF do responsável"
                      disabled={loading || !availability.available}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contato do Responsável
                    </label>
                    <input
                      type="text"
                      value={crianca.contatoResponsavel}
                      onChange={(e) => updateCrianca(index, 'contatoResponsavel', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Telefone e/ou email do responsável"
                      disabled={loading || !availability.available}
                    />
                  </div>

                  {/* Autorização de Imagem */}
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id={`autorizacao-${index}`}
                      checked={crianca.autorizacaoImagem}
                      onChange={(e) => updateCrianca(index, 'autorizacaoImagem', e.target.checked)}
                      className="mr-2"
                      disabled={loading || !availability.available}
                    />
                    <label htmlFor={`autorizacao-${index}`} className="text-sm text-gray-700">
                      Autorizo o uso de imagens da criança para fins educativos e de divulgação
                    </label>
                  </div>

                  {/* Informações Médicas e Acessibilidade */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Informações Médicas ou de Acessibilidade
                    </label>
                    <textarea
                      value={crianca.informacoesMedicas}
                      onChange={(e) => updateCrianca(index, 'informacoesMedicas', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Alergias, medicamentos, necessidades especiais, etc."
                      rows="2"
                      disabled={loading || !availability.available}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 📝 INFORMAÇÕES ADICIONAIS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Informações Adicionais
          </label>
          <textarea
            value={formData.informacoesAdicionais}
            onChange={(e) => setFormData({
              ...formData,
              informacoesAdicionais: e.target.value
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Alguma informação adicional que considere importante..."
            rows="3"
            disabled={loading || !availability.available}
          />
        </div>

        {/* ℹ️ INFORMAÇÕES IMPORTANTES */}
        <InfoMessage 
          title="Informações Importantes para a Visita"
          message="• Chegue com 15 minutos de antecedência • Apresente documento com foto na entrada • Use vestimenta adequada • Respeite as normas de segurança do quartel • Crianças devem estar acompanhadas dos responsáveis"
          icon="⚠️"
        />

        {/* 📊 RESUMO ATUALIZADO */}
        <div className={`border rounded-lg p-4 ${
          !availability.available ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            !availability.available ? 'text-red-800' : 'text-green-800'
          }`}>
            Resumo da Visita
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Data:</div>
            <div className="font-medium">{selectedDay.dia}/{mes}/{ano}</div>
            
            <div className="text-gray-600">Horário:</div>
            <div className="font-medium">{formData.data.horario}</div>
            
            <div className="text-gray-600">Total de Adultos:</div>
            <div className="font-medium">{formData.adultos.length}/{maxAdultos}</div>
            
            <div className="text-gray-600">Total de Crianças:</div>
            <div className="font-medium">{formData.criancas.length}/{maxCriancas}</div>
            
            <div className="text-gray-600">Total de Pessoas:</div>
            <div className="font-medium">{totalPessoas}</div>
            
            <div className="text-gray-600">Vagas Restantes:</div>
            <div className={`font-medium ${
              vagasRestantes < 5 ? 'text-red-600' : 'text-green-600'
            }`}>
              {vagasRestantes} / {availability.maxLimit}
            </div>
          </div>
        </div>

        {/* 🎯 BOTÕES DE AÇÃO */}
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
            disabled={loading || !availability.available || availableTimes.length === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando Agendamento...
              </>
            ) : !availability.available ? (
              'Horário Lotado'
            ) : availableTimes.length === 0 ? (
              'Nenhum Horário Disponível'
            ) : (
              `Confirmar Agendamento (${totalPessoas} pessoas)`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedBookingForm;