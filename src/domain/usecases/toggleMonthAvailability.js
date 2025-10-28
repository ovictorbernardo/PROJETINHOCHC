import { liberarMes, bloquearMes } from '../../utils/initialData.js';
import AgendaRepository from '../../repositories/AgendaRepository.js';

export async function toggleMonthAvailability(mesAno, liberar = true) {
  if (!mesAno) throw new Error('Mês/ano inválido.');

  if (liberar) {
    await liberarMes(mesAno);
    await AgendaRepository.updateMonthData(mesAno, { meta: { disponivel: true } });
    return { disponivel: true };
  } else {
    await bloquearMes(mesAno);
    await AgendaRepository.updateMonthData(mesAno, { meta: { disponivel: false } });
    return { disponivel: false };
  }
}
