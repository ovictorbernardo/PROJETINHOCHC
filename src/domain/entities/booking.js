export class Booking {
  constructor({ id, nome, dia, horario, status = 'ativo' }) {
    this.id = id;
    this.nome = nome;
    this.dia = dia;
    this.horario = horario;
    this.status = status;
  }
}
