// Configuração de disponibilidade por mês
const mesesDisponiveis = {
  // Exemplo: "10-2025": true
};

export const getDiasNoMes = (mes, ano) => {
  return new Date(ano, mes, 0).getDate();
};

export const getDiaDaSemana = (dia, mes, ano) => {
  return new Date(ano, mes - 1, dia).getDay();
};

export const getNomeMes = (mes) => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mes - 1] || 'Mês inválido';
};

export const getProximoMes = (mesAno) => {
  const [mes, ano] = mesAno.split('-').map(Number);
  let proximoMes = mes + 1;
  let proximoAno = ano;
  
  if (proximoMes > 12) {
    proximoMes = 1;
    proximoAno = ano + 1;
  }
  
  return `${proximoMes.toString().padStart(2, '0')}-${proximoAno}`;
};

export const getMesAnterior = (mesAno) => {
  const [mes, ano] = mesAno.split('-').map(Number);
  let mesAnterior = mes - 1;
  let anoAnterior = ano;
  
  if (mesAnterior < 1) {
    mesAnterior = 12;
    anoAnterior = ano - 1;
  }
  
  return `${mesAnterior.toString().padStart(2, '0')}-${anoAnterior}`;
};

export const isMesDisponivel = (mesAno) => {
  return mesesDisponiveis[mesAno] || false;
};

export const liberarMes = (mesAno) => {
  mesesDisponiveis[mesAno] = true;
  return true;
};

export const bloquearMes = (mesAno) => {
  mesesDisponiveis[mesAno] = false;
  return false;
};

export const getInitialAgenda = (mesAno) => {
  const [mes, ano] = mesAno.split('-').map(Number);
  const diasNoMes = getDiasNoMes(mes, ano);
  const nomeMes = getNomeMes(mes);
  const mesDisponivel = isMesDisponivel(mesAno);
  
  const dias = [];
  
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const diaSemana = getDiaDaSemana(dia, mes, ano);
    
    // PADRÃO: Todos os dias começam como "indisponivel"
    let status = 'indisponivel';
    let observacao = 'Mês não liberado para agendamentos';
    
    // SE o mês estiver disponível, aplica as regras normais
    if (mesDisponivel) {
      status = 'disponivel';
      observacao = '';
      
      if (diaSemana === 0) {
        status = 'fechado';
        observacao = 'Fechado aos domingos';
      } else if (diaSemana === 6) {
        observacao = 'Horário especial de sábado';
      }
    }
    
    dias.push({
      dia: dia,
      status: status,
      observacao: observacao,
      horarios: ['10:00', '14:00', '16:00']
    });
  }
  
  return { 
    dias,
    meta: {
      mes,
      ano,
      nomeMes,
      diasNoMes,
      mesAno,
      disponivel: mesDisponivel
    }
  };
};

export const getMesAnoAtual = () => {
  const now = new Date();
  const mes = (now.getMonth() + 1).toString().padStart(2, '0');
  const ano = now.getFullYear();
  return `${mes}-${ano}`;
};

const initialAgenda = {};

export const getAgendaByMesAno = (mesAno) => {
  if (!initialAgenda[mesAno]) {
    initialAgenda[mesAno] = getInitialAgenda(mesAno);
  }
  return initialAgenda[mesAno];
};