// src/utils/bookingTypes.js

// Tipos para adultos
export const adultTemplate = {
  nome: '',
  cpf: '',
  email: '',
  telefone: ''
};

// Tipos para crianças
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

// Estrutura completa do agendamento
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

// Validações
export const validateCPF = (cpf) => {
  // Validação básica de CPF (pode ser aprimorada)
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const calculateAge = (dataNascimento) => {
  const today = new Date();
  const birthDate = new Date(dataNascimento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};