import { Dieta } from "../../domain/entities/Dieta"

export class CriarDietaResponseDTO {
  constructor(
    public readonly idDieta: number,
    public readonly dataInicio: string,
    public readonly dataFim: string,
    public readonly descricao: string
  ) {}

  static fromDieta(dieta: Dieta | null): CriarDietaResponseDTO {
    if (!dieta) {
      throw new Error("Dieta não encontrada")
    }
    return new CriarDietaResponseDTO(
      dieta.idDieta,
      dieta.dataInicio,
      dieta.dataFim,
      dieta.descricao
    )
  }
}
