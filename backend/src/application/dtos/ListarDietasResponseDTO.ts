import { Dieta } from "../../domain/entities/Dieta"
import { CriarDietaResponseDTO } from "./ConsultarDietaResponseDTO"

export class ListarDietasResponseDTO {
  constructor(public readonly dietas: CriarDietaResponseDTO[]) {}

  static fromDietas(dietas: Dieta[]): ListarDietasResponseDTO {
    const dietasResponse = dietas.map((dieta) =>
      CriarDietaResponseDTO.fromDieta(dieta)
    )
    return new ListarDietasResponseDTO(dietasResponse)
  }
}
