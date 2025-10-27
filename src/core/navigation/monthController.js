import { getMesAnoAtual, getProximoMes, getMesAnterior } from '../../utils/initialData';
import { setCurrentMesAno } from '../../store/slices/agendaSlice';

export const createMonthController = ({ dispatch, currentMesAno }) => ({
  goNext: () => {
    const proximo = getProximoMes(currentMesAno);
    dispatch(setCurrentMesAno(proximo));
    return proximo;
  },
  goPrev: () => {
    const anterior = getMesAnterior(currentMesAno);
    dispatch(setCurrentMesAno(anterior));
    return anterior;
  },
  goCurrent: () => {
    const atual = getMesAnoAtual();
    dispatch(setCurrentMesAno(atual));
    return atual;
  }
});
export default createMonthController;
