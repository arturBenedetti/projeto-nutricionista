export class Dieta {
  public idDieta: number
  public dataInicio: string
  public dataFim: string
  public descricao: string

  constructor(props: {
    idDieta: number
    dataInicio: string
    dataFim: string
    descricao: string
  }) {
    this.idDieta = props.idDieta
    this.dataInicio = props.dataInicio
    this.dataFim = props.dataFim
    this.descricao = props.descricao
  }
}
