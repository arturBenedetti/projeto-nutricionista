import { AlimentoRefeicao } from "./AlimentoRefeicao"

/**
 * Representa uma refeição com seus alimentos e observações
 */
export class Refeicao {
  constructor(
    public readonly id: string,
    public nome: string, // Ex: "Café da Manhã", "Almoço", "Jantar", "Lanche"
    public alimentos: AlimentoRefeicao[],
    public observacao?: string
  ) {}
}


