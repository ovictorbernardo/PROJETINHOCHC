export class Day {
  constructor({ dia, data, status, horarios = {} }) {
    this.dia = dia;
    this.data = data;
    this.status = status;
    this.horarios = horarios;
  }

  getHorariosDisponiveis() {
    return Object.entries(this.horarios)
      .filter(([_, h]) => h.disponivel)
      .map(([hora]) => hora);
  }

  isDisponivel() {
    return this.status === 'disponivel';
  }
}
