// src/domain/usecases/getAgendaByMonth.js
import AgendaRepository from '../../repositories/AgendaRepository.js';

/**
 * Usecase responsável por obter a agenda de um determinado mês.
 * Abstrai o repositório Firebase e retorna os dados crus para a camada de integração.
 */
export const getAgendaByMonth = async (mesAno) => {
  if (!mesAno) throw new Error('O parâmetro mesAno é obrigatório.');

  try {
    const data = await AgendaRepository.getMonthData(mesAno);
    return data || [];
  } catch (error) {
    console.error('[Usecase:getAgendaByMonth] Erro ao buscar dados do mês:', error);
    throw error;
  }
};
