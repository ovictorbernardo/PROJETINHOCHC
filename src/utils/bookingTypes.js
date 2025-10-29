// src/utils/bookingTypes.js - ATUALIZADO

/* ============================================================
   🎯 TEMPLATES DE DADOS
   ============================================================ */

// Template para crianças
export const childTemplate = {
  nomeCompleto: '',
  dataNascimento: '',
  idade: '',
  nomeResponsavel: '',
  documentoResponsavel: '',
  contatoResponsavel: '',
  autorizacaoImagem: false,
  informacoesMedicas: '',
  necessidadesAcessibilidade: ''
};

// Template para adultos
export const adultTemplate = {
  nome: '',
  cpf: '',
  email: '',
  telefone: ''
};

// Estrutura completa de um agendamento
export const bookingTemplate = {
  // Informações da visita
  data: {
    dia: '',
    mesAno: '',
    horario: ''
  },

  // Adultos (mínimo 1)
  adultos: [adultTemplate],

  // Crianças (opcional)
  criancas: [],

  // Informações gerais
  informacoesAdicionais: '',

  // Metadados
  status: 'pendente',
  createdAt: '',
  updatedAt: ''
};

/* ============================================================
   🧩 FUNÇÕES DE VALIDAÇÃO
   ============================================================ */

// Validação simples de CPF
export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
};

// Validação básica de e-mail
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Cálculo de idade a partir da data de nascimento
export const calculateAge = (dataNascimento) => {
  if (!dataNascimento) return '';
  
  const today = new Date();
  const birthDate = new Date(dataNascimento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/* ============================================================
   ✅ EXPORTS
   ============================================================ */

export default {
  adultTemplate,
  childTemplate,
  bookingTemplate,
  validateCPF,
  validateEmail,
  calculateAge
};
