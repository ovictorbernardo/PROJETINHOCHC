// src/utils/initialData.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  query,
  where 
} from 'firebase/firestore';
import { db } from '../services/firebase';

// 🗂️ CHAVES DE ARMAZENAMENTO
const STORAGE_KEYS = {
  MESES_DISPONIVEIS: 'agenda_meses_disponiveis',
  AGENDA: 'agenda_data',
  DAY_CONFIGS: 'day_configs'
};

// 🎯 FUNÇÕES DE PERSISTÊNCIA LOCAL
const salvarNoLocalStorage = (chave, dados) => {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    console.log('💾 Dados salvos no localStorage:', chave);
  } catch (error) {
    console.error('❌ Erro ao salvar no localStorage:', error);
  }
};

const carregarDoLocalStorage = (chave, padrao = {}) => {
  try {
    const stored = localStorage.getItem(chave);
    return stored ? JSON.parse(stored) : padrao;
  } catch (error) {
    console.error('❌ Erro ao carregar do localStorage:', error);
    return padrao;
  }
};

// 🎯 VALIDAR E FORMATAR mesAno
const validarMesAno = (mesAno) => {
  if (!mesAno) {
    throw new Error('mesAno é obrigatório');
  }
  
  // Se já estiver no formato MM-AAAA, retornar como está
  if (typeof mesAno === 'string' && mesAno.includes('-')) {
    const [mes, ano] = mesAno.split('-');
    if (mes && ano && mes.length === 2 && ano.length === 4) {
      return mesAno;
    }
  }
  
  // Se for Date object
  if (mesAno instanceof Date) {
    const mes = String(mesAno.getMonth() + 1).padStart(2, '0');
    const ano = mesAno.getFullYear();
    return `${mes}-${ano}`;
  }
  
  throw new Error(`Formato de mesAno inválido: ${mesAno}`);
};

// 🎯 FUNÇÕES FIREBASE - DAY CONFIGS
export const salvarDayConfigFirebase = async (mesAno, dia, config) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const docId = `${mesAnoValidado}-${dia.toString().padStart(2, '0')}`;
    const docRef = doc(db, 'dayConfigs', docId);
    
    await setDoc(docRef, {
      ...config,
      mesAno: mesAnoValidado,
      dia,
      ultimaAtualizacao: new Date().toISOString(),
      sincronizado: true
    });
    
    console.log('✅ Configuração salva no Firebase:', docId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar dayConfig no Firebase:', error);
    return false;
  }
};

export const carregarDayConfigFirebase = async (mesAno, dia) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const docId = `${mesAnoValidado}-${dia.toString().padStart(2, '0')}`;
    const docRef = doc(db, 'dayConfigs', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('📥 DayConfig carregado do Firebase:', docId);
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao carregar dayConfig do Firebase:', error);
    return null;
  }
};

export const carregarTodosDayConfigsMes = async (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const dayConfigsRef = collection(db, 'dayConfigs');
    const q = query(dayConfigsRef, where('mesAno', '==', mesAnoValidado));
    const querySnapshot = await getDocs(q);
    
    const configs = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      configs[data.dia] = data;
    });
    
    console.log(`📥 ${Object.keys(configs).length} dayConfigs carregados para ${mesAnoValidado}`);
    return configs;
  } catch (error) {
    console.error('❌ Erro ao carregar dayConfigs do mês:', error);
    return {};
  }
};

// 🎯 FUNÇÕES FIREBASE - MESES DISPONÍVEIS
export const salvarMesesDisponiveisFirebase = async (mesesDisponiveis) => {
  try {
    const docRef = doc(db, 'configuracoes', 'mesesDisponiveis');
    await setDoc(docRef, {
      meses: mesesDisponiveis,
      ultimaAtualizacao: new Date().toISOString()
    });
    console.log('✅ Meses disponíveis salvos no Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar meses disponíveis no Firebase:', error);
    return false;
  }
};

export const carregarMesesDisponiveisFirebase = async () => {
  try {
    const docRef = doc(db, 'configuracoes', 'mesesDisponiveis');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('📥 Meses disponíveis carregados do Firebase');
      return docSnap.data().meses || {};
    }
    return {};
  } catch (error) {
    console.error('❌ Erro ao carregar meses disponíveis do Firebase:', error);
    return {};
  }
};

// 🗓️ SISTEMA DE MESES DISPONÍVEIS (SINCRONIZADO)
let mesesDisponiveis = carregarDoLocalStorage(STORAGE_KEYS.MESES_DISPONIVEIS, {});

// 🔄 SINCRONIZAR MESES DISPONÍVEIS COM FIREBASE
export const sincronizarMesesDisponiveis = async () => {
  try {
    const firebaseMeses = await carregarMesesDisponiveisFirebase();
    
    if (Object.keys(firebaseMeses).length > 0) {
      mesesDisponiveis = { ...mesesDisponiveis, ...firebaseMeses };
      salvarNoLocalStorage(STORAGE_KEYS.MESES_DISPONIVEIS, mesesDisponiveis);
      console.log('🔄 Meses disponíveis sincronizados com Firebase');
    } else if (Object.keys(mesesDisponiveis).length > 0) {
      await salvarMesesDisponiveisFirebase(mesesDisponiveis);
    }
    
    return mesesDisponiveis;
  } catch (error) {
    console.error('❌ Erro na sincronização de meses:', error);
    return mesesDisponiveis;
  }
};

const salvarMesesDisponiveis = (meses) => {
  mesesDisponiveis = meses;
  salvarNoLocalStorage(STORAGE_KEYS.MESES_DISPONIVEIS, meses);
  salvarMesesDisponiveisFirebase(meses).catch(error => {
    console.warn('⚠️ Não foi possível sincronizar meses com Firebase:', error);
  });
};

const carregarMesesDisponiveis = () => mesesDisponiveis;

// 🗓️ FUNÇÕES UTILITÁRIAS DE DATA
export const getDiasNoMes = (mes, ano) => {
  const mesNum = typeof mes === 'string' ? parseInt(mes) : mes;
  const anoNum = typeof ano === 'string' ? parseInt(ano) : ano;
  return new Date(anoNum, mesNum, 0).getDate();
};

export const getDiaDaSemana = (dia, mes, ano) => {
  const mesNum = typeof mes === 'string' ? parseInt(mes) : mes;
  const anoNum = typeof ano === 'string' ? parseInt(ano) : ano;
  return new Date(anoNum, mesNum - 1, dia).getDay();
};

export const getNomeMes = (mes) => {
  const mesNum = typeof mes === 'string' ? parseInt(mes) : mes;
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mesNum - 1] || 'Mês inválido';
};

export const getProximoMes = (mesAno) => {
  const mesAnoValidado = validarMesAno(mesAno);
  const [mes, ano] = mesAnoValidado.split('-').map(Number);
  let proximoMes = mes + 1;
  let proximoAno = ano;
  if (proximoMes > 12) {
    proximoMes = 1;
    proximoAno = ano + 1;
  }
  return `${proximoMes.toString().padStart(2, '0')}-${proximoAno}`;
};

export const getMesAnterior = (mesAno) => {
  const mesAnoValidado = validarMesAno(mesAno);
  const [mes, ano] = mesAnoValidado.split('-').map(Number);
  let mesAnterior = mes - 1;
  let anoAnterior = ano;
  if (mesAnterior < 1) {
    mesAnterior = 12;
    anoAnterior = ano - 1;
  }
  return `${mesAnterior.toString().padStart(2, '0')}-${anoAnterior}`;
};

export const isMesDisponivel = (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    return mesesDisponiveis[mesAnoValidado] !== false;
  } catch (error) {
    console.warn('⚠️ Erro ao verificar disponibilidade do mês:', error);
    return false;
  }
};

// 🆕 ESTRUTURA E UTILITÁRIOS DE HORÁRIOS
export const HORARIOS_PADRAO = ['10:00', '14:00', '16:00'];
export const LOTACAO_MAXIMA = 30;

export const generateHorariosPadrao = (statusInicial = 'disponivel') => {
  const horarios = {};
  HORARIOS_PADRAO.forEach(horario => {
    horarios[horario] = {
      status: statusInicial,
      lotacaoAtual: 0,
      lotacaoMaxima: LOTACAO_MAXIMA,
      disponivel: statusInicial === 'disponivel',
      agendamentos: []
    };
  });
  return horarios;
};

// ✅ LIBERAR / BLOQUEAR MÊS
export const liberarMes = async (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    mesesDisponiveis[mesAnoValidado] = true;
    salvarMesesDisponiveis(mesesDisponiveis);

    const agenda = await loadMonthData(mesAnoValidado);
    if (agenda && agenda.dias) {
      for (const dia of agenda.dias) {
        if (dia.status === 'indisponivel' && !dia.ehDomingo && !dia.ehPassado) {
          const configAtualizada = {
            ...dia,
            status: 'disponivel',
            disponivel: true,
            observacao: 'Dia liberado'
          };
          await salvarDayConfigFirebase(mesAnoValidado, dia.dia, configAtualizada);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao liberar mês:', error);
    return false;
  }
};

export const bloquearMes = async (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    mesesDisponiveis[mesAnoValidado] = false;
    salvarMesesDisponiveis(mesesDisponiveis);

    const agenda = await loadMonthData(mesAnoValidado);
    if (agenda && agenda.dias) {
      for (const dia of agenda.dias) {
        if (dia.disponivel && !dia.ehDomingo && !dia.ehPassado) {
          const configAtualizada = {
            ...dia,
            status: 'indisponivel',
            disponivel: false,
            observacao: 'Mês bloqueado'
          };
          await salvarDayConfigFirebase(mesAnoValidado, dia.dia, configAtualizada);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao bloquear mês:', error);
    return false;
  }
};

// ✅ NOVA FUNÇÃO: GERAR AGENDA LIBERADA
export const generateAgendaLiberada = (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const [mes, ano] = mesAnoValidado.split('-').map(Number);
    const diasNoMes = getDiasNoMes(mes, ano);
    const nomeMes = getNomeMes(mes);
    const dias = [];

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const diaSemana = data.getDay();
      const ehDomingo = diaSemana === 0;
      const hoje = new Date();
      const ehPassado = data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      const ehHoje = data.toDateString() === hoje.toDateString();

      let status = 'disponivel';
      let observacao = '';

      if (ehDomingo) {
        status = 'fechado';
        observacao = 'Domingo - Fechado';
      } else if (ehPassado && !ehHoje) {
        status = 'indisponivel';
        observacao = 'Data passada';
      } else if (diaSemana === 6) {
        observacao = 'Horário especial de sábado';
      }

      const statusHorario = ehDomingo || ehPassado ? 'indisponivel' : 'disponivel';

      dias.push({
        dia,
        data: data.toISOString().split('T')[0],
        status,
        disponivel: status === 'disponivel',
        ehDomingo,
        ehPassado,
        observacao,
        horarios: generateHorariosPadrao(statusHorario),
        criadoEm: new Date().toISOString()
      });
    }

    return {
      dias,
      meta: {
        mes,
        ano,
        nomeMes,
        diasNoMes,
        mesAno: mesAnoValidado,
        disponivel: true,
        criadoEm: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Erro ao gerar agenda liberada:', error);
    // 🎯 FALLBACK: Gerar para mês atual
    const dataAtual = new Date();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const mesAnoFallback = `${mes}-${ano}`;
    return generateAgendaLiberada(mesAnoFallback);
  }
};

// 🎯 GERAR DIA PADRÃO (AGORA COM HORÁRIOS COMO OBJETO)
const generateDiaPadrao = (mes, ano, dia, mesDisponivel = true) => {
  const mesNum = typeof mes === 'string' ? parseInt(mes) : mes;
  const anoNum = typeof ano === 'string' ? parseInt(ano) : ano;
  
  const data = new Date(anoNum, mesNum - 1, dia);
  const diaSemana = data.getDay();
  const ehDomingo = diaSemana === 0;
  const hoje = new Date();
  const ehPassado = data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const ehHoje = data.toDateString() === hoje.toDateString();

  let statusGeral = 'disponivel';
  let observacao = '';

  if (ehDomingo) {
    statusGeral = 'fechado';
    observacao = 'Domingo - Fechado';
  } else if (ehPassado && !ehHoje) {
    statusGeral = 'indisponivel';
    observacao = 'Data passada';
  } else if (!mesDisponivel) {
    statusGeral = 'indisponivel';
    observacao = 'Mês não liberado';
  } else if (diaSemana === 6) {
    observacao = 'Horário especial de sábado';
  }

  // Determina status base para horários
  const statusHorario = (ehDomingo || ehPassado || !mesDisponivel) ? 'indisponivel' : 'disponivel';
  const horarios = generateHorariosPadrao(statusHorario);

  return {
    dia,
    data: data.toISOString().split('T')[0],
    status: statusGeral,
    disponivel: statusGeral === 'disponivel',
    lotado: false,
    ehDomingo,
    ehPassado,
    observacao,
    horarios,
    criadoEm: new Date().toISOString(),
    sincronizado: false
  };
};

// 🎯 GERAR AGENDA A PARTIR DE CONFIGURAÇÕES DO FIREBASE
const generateAgendaFromConfigs = (mesAno, configs) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const [mes, ano] = mesAnoValidado.split('-').map(Number);
    const diasNoMes = getDiasNoMes(mes, ano);
    const nomeMes = getNomeMes(mes);
    const dias = [];

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const config = configs[dia];
      if (config) {
        dias.push({
          ...config,
          dia,
          data: new Date(ano, mes - 1, dia).toISOString().split('T')[0]
        });
      } else {
        dias.push(generateDiaPadrao(mes, ano, dia));
      }
    }

    return {
      dias,
      meta: {
        mes,
        ano,
        nomeMes,
        diasNoMes,
        mesAno: mesAnoValidado,
        disponivel: isMesDisponivel(mesAnoValidado),
        carregadoDoFirebase: true,
        ultimaAtualizacao: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Erro ao gerar agenda a partir de configs:', error);
    throw error;
  }
};

// 🎯 GERAR AGENDA PADRÃO
const generateAgendaPadrao = (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const [mes, ano] = mesAnoValidado.split('-').map(Number);
    const diasNoMes = getDiasNoMes(mes, ano);
    const nomeMes = getNomeMes(mes);
    const mesDisponivel = isMesDisponivel(mesAnoValidado);
    const dias = [];

    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(generateDiaPadrao(mes, ano, dia, mesDisponivel));
    }

    return {
      dias,
      meta: {
        mes,
        ano,
        nomeMes,
        diasNoMes,
        mesAno: mesAnoValidado,
        disponivel: mesDisponivel,
        carregadoDoFirebase: false,
        criadoEm: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Erro ao gerar agenda padrão:', error);
    throw error;
  }
};

// 🎯 SISTEMA PRINCIPAL DE CARREGAMENTO DE DADOS (CORRIGIDO)
export const loadMonthData = async (mesAno) => {
  console.log('🔄 Carregando dados para:', mesAno);
  
  try {
    // 🎯 VALIDAR mesAno
    const mesAnoValidado = validarMesAno(mesAno);
    
    // 1. TENTAR CARREGAR DO FIREBASE
    const firebaseConfigs = await carregarTodosDayConfigsMes(mesAnoValidado);
    
    if (Object.keys(firebaseConfigs).length > 0) {
      console.log('📥 Dados carregados do Firebase');
      const agenda = generateAgendaFromConfigs(mesAnoValidado, firebaseConfigs);
      return agenda;
    }
    
    // 2. FALLBACK: AGENDA PADRÃO
    console.log('📝 Gerando agenda padrão para:', mesAnoValidado);
    const agendaPadrao = generateAgendaPadrao(mesAnoValidado);
    return agendaPadrao;
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    
    // 🎯 FALLBACK FINAL: Gerar agenda básica
    try {
      const dataAtual = new Date();
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
      const ano = dataAtual.getFullYear();
      const mesAnoFallback = `${mes}-${ano}`;
      
      console.log('🔄 Usando fallback final:', mesAnoFallback);
      return generateAgendaPadrao(mesAnoFallback);
    } catch (fallbackError) {
      console.error('❌ Erro no fallback final:', fallbackError);
      
      // 🎯 ÚLTIMO RECURSO: Objeto vazio mas válido
      return {
        dias: [],
        meta: {
          mes: 1,
          ano: new Date().getFullYear(),
          nomeMes: 'Mês',
          disponivel: false,
          carregadoDoFirebase: false,
          criadoEm: new Date().toISOString()
        }
      };
    }
  }
};

// 🆕 FUNÇÃO PARA ATUALIZAR STATUS DE HORÁRIO ESPECÍFICO
export const atualizarHorarioDia = async (mesAno, dia, horario, novasConfigs) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    
    // Carregar configuração atual do dia
    const configAtual = await carregarDayConfigFirebase(mesAnoValidado, dia) || 
                        generateDiaPadrao(...mesAnoValidado.split('-').map(Number), dia);
    
    // Atualizar horário específico
    const horariosAtualizados = {
      ...configAtual.horarios,
      [horario]: {
        ...((configAtual.horarios && configAtual.horarios[horario]) || {}),
        ...novasConfigs,
        disponivel: novasConfigs.status === 'disponivel'
      }
    };

    // Verificar status geral do dia baseado nos horários
    const statusGeral = Object.values(horariosAtualizados).some(h => h.disponivel) ? 'disponivel' : 'indisponivel';
    const lotado = Object.values(horariosAtualizados).every(h => h.status === 'lotado');

    const configAtualizada = {
      ...configAtual,
      horarios: horariosAtualizados,
      status: statusGeral,
      disponivel: statusGeral === 'disponivel',
      lotado,
      ultimaAtualizacao: new Date().toISOString()
    };

    // Salvar no Firebase
    const sucesso = await salvarDayConfigFirebase(mesAnoValidado, dia, configAtualizada);
    
    if (sucesso) {
      console.log('✅ Horário atualizado:', { mesAno: mesAnoValidado, dia, horario, config: novasConfigs });
      return configAtualizada;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao atualizar horário:', error);
    throw error;
  }
};

// 🆕 FUNÇÃO PARA OBTER HORÁRIOS DISPONÍVEIS
export const getHorariosDisponiveis = (diaConfig) => {
  if (!diaConfig || !diaConfig.horarios) return [];
  
  return Object.entries(diaConfig.horarios)
    .filter(([horario, config]) => config.disponivel && config.status === 'disponivel')
    .map(([horario]) => horario);
};

// 🆕 FUNÇÃO PARA VERIFICAR DISPONIBILIDADE DE HORÁRIO ESPECÍFICO
export const verificarDisponibilidadeHorario = (diaConfig, horario) => {
  if (!diaConfig || !diaConfig.horarios || !diaConfig.horarios[horario]) {
    return { disponivel: false, motivo: 'Horário não configurado' };
  }
  
  const configHorario = diaConfig.horarios[horario];
  return {
    disponivel: configHorario.disponivel && configHorario.status === 'disponivel',
    lotacaoAtual: configHorario.lotacaoAtual,
    lotacaoMaxima: configHorario.lotacaoMaxima,
    vagasRestantes: configHorario.lotacaoMaxima - configHorario.lotacaoAtual
  };
};

// 🎯 ATUALIZAR CONFIGURAÇÃO DE DIA
export const atualizarConfiguracaoDia = async (mesAno, dia, novasConfigs) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const configAtualizada = {
      ...novasConfigs,
      mesAno: mesAnoValidado,
      dia,
      ultimaAtualizacao: new Date().toISOString()
    };
    const sucessoFirebase = await salvarDayConfigFirebase(mesAnoValidado, dia, configAtualizada);
    if (sucessoFirebase) {
      console.log('✅ Configuração sincronizada com Firebase:', `${mesAnoValidado}-${dia}`);
      return configAtualizada;
    } else {
      console.log('⚠️ Configuração salva apenas localmente');
      return configAtualizada;
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar configuração do dia:', error);
    throw error;
  }
};

// 🎯 UTILIDADES
export const getMesAnoAtual = () => {
  const now = new Date();
  const mes = (now.getMonth() + 1).toString().padStart(2, '0');
  const ano = now.getFullYear();
  return `${mes}-${ano}`;
};

export const formatarDataParaExibicao = (mesAno) => {
  try {
    const mesAnoValidado = validarMesAno(mesAno);
    const [mes, ano] = mesAnoValidado.split('-').map(Number);
    return `${getNomeMes(mes)} de ${ano}`;
  } catch (error) {
    console.error('❌ Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

// 🔄 INICIALIZAR
sincronizarMesesDisponiveis();

// 🎯 EXPORTAÇÕES
export const getInitialAgenda = loadMonthData;
export const getAgendaByMesAno = loadMonthData;
export { mesesDisponiveis as getMesesDisponiveis };

export default {
  loadMonthData,
  sincronizarMesesDisponiveis,
  atualizarConfiguracaoDia,
  getMesAnoAtual,
  formatarDataParaExibicao,
  liberarMes,
  bloquearMes,
  generateAgendaLiberada,
  HORARIOS_PADRAO,
  LOTACAO_MAXIMA,
  generateHorariosPadrao,
  atualizarHorarioDia,
  getHorariosDisponiveis,
  verificarDisponibilidadeHorario,
  isMesDisponivel
};