/**
 * Representa um alimento com sua quantidade em uma refeição
 */
export class AlimentoRefeicao {
  constructor(
    public idAlimento: string,
    public quantidade: number, // quantidade em gramas
    public nomeAlimento?: string // opcional, para facilitar exibição sem join
  ) {}
}


