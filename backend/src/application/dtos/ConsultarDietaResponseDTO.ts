import { Dieta } from "../../domain/entities/Dieta"

export class CriarDietaResponseDTO {
  constructor(
    public readonly id: string,
    public readonly idNutricionista: string,
    public readonly idPaciente: string,
    public readonly dataInicio: string,
    public readonly dataFim: string,
    public readonly descricao: string,
    public readonly observacoes?: string
  ) {}

  static fromDieta(dieta: Dieta | null): CriarDietaResponseDTO {
    if (!dieta) {
      throw new Error("Dieta não encontrada")
    }
    return new CriarDietaResponseDTO(
      dieta.id,
      dieta.idNutricionista,
      dieta.idPaciente,
      dieta.dataInicio.toISOString(),
      dieta.dataFim.toISOString(),
      dieta.descricao,
      dieta.observacoes
    )
  }
}
