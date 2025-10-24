export class Dieta {
  constructor(
    public readonly id: string,
    public idNutricionista: string,
    public idPaciente: string,
    public dataInicio: Date,
    public dataFim: Date,
    public descricao: string,
    public observacoes?: string
  ) {}
}
