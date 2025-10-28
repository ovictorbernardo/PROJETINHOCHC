export class Horario {
  constructor({ hora, status = 'disponivel', lotacaoAtual = 0, lotacaoMaxima = 30, agendamentos = [] }) {
    this.hora = hora;
    this.status = status;
    this.lotacaoAtual = lotacaoAtual;
    this.lotacaoMaxima = lotacaoMaxima;
    this.agendamentos = agendamentos;
  }

  get vagasRestantes() {
    return this.lotacaoMaxima - this.lotacaoAtual;
  }

  isDisponivel() {
    return this.status === 'disponivel' && this.vagasRestantes > 0;
  }
}
