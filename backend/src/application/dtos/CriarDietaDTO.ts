import { PlanoRefeicaoDTO } from "./PlanoRefeicaoDTO"

export interface CriarDietaDTO {
  idNutricionista: string
  idPaciente: string
  dataInicio: string
  dataFim: string
  descricao: string
  observacoes?: string
  planosRefeicao?: PlanoRefeicaoDTO[] // Planos de refeições por dia da semana
}
