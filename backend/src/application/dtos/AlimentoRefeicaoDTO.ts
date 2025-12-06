/**
 * DTO para representar um alimento com quantidade em uma refeição
 */
export interface AlimentoRefeicaoDTO {
  idAlimento: string
  quantidade: number // quantidade em gramas
  nomeAlimento?: string // opcional, para facilitar exibição
}


