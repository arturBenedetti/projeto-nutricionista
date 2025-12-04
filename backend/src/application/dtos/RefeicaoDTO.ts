import { AlimentoRefeicaoDTO } from "./AlimentoRefeicaoDTO"

/**
 * DTO para representar uma refeição
 */
export interface RefeicaoDTO {
  id?: string
  nome: string // Ex: "Café da Manhã", "Almoço", "Jantar", "Lanche"
  alimentos: AlimentoRefeicaoDTO[]
  observacao?: string
}


