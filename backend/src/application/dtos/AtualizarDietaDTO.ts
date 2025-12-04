import { PlanoRefeicaoDTO } from "./PlanoRefeicaoDTO"

export interface AtualizarDietaDTO {
  id: string
  idNutricionista: string
  idPaciente: string
  dataInicio: string
  dataFim: string
  descricao: string
  observacoes?: string
  planosRefeicao?: PlanoRefeicaoDTO[] // Planos de refeições por dia da semana
}

