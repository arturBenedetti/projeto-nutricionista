import { PlanoRefeicao } from "./PlanoRefeicao"

export class Dieta {
  constructor(
    public readonly id: string,
    public idNutricionista: string,
    public idPaciente: string,
    public dataInicio: Date,
    public dataFim: Date,
    public descricao: string,
    public observacoes?: string,
    public planosRefeicao?: PlanoRefeicao[] // Planos de refeições por dia da semana
  ) {}
}
