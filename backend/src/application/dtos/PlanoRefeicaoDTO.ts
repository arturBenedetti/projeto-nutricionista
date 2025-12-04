import { RefeicaoDTO } from "./RefeicaoDTO"

/**
 * DTO para representar o plano de refeições de um dia da semana
 * Dias da semana: 0 = Domingo, 1 = Segunda, 2 = Terça, ..., 6 = Sábado
 */
export interface PlanoRefeicaoDTO {
  id?: string
  diaSemana: number // 0-6 (Domingo a Sábado)
  refeicoes: RefeicaoDTO[]
}


