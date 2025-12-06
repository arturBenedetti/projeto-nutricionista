import { Refeicao } from "./Refeicao"

/**
 * Representa o plano de refeições para um dia da semana
 * Dias da semana: 0 = Domingo, 1 = Segunda, 2 = Terça, ..., 6 = Sábado
 */
export class PlanoRefeicao {
  constructor(
    public readonly id: string,
    public diaSemana: number, // 0-6 (Domingo a Sábado)
    public refeicoes: Refeicao[]
  ) {}
}


