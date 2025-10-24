import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { ListarDietasDTO } from "../../application/dtos/ListarDietasDTO"
import { ListarDietasResponseDTO } from "../../application/dtos/ListarDietasResponseDTO"

export class ListDietasUseCase {
  constructor(private dietaRepo: IDietaRepository) {}

  async listarDietas(
    dto: ListarDietasDTO
  ): Promise<ListarDietasResponseDTO | null> {
    try {
      const dietas = await this.dietaRepo.findAllByNutricionistaId(
        dto.idNutricionista
      )
      return ListarDietasResponseDTO.fromDietas(dietas)
    } catch (error) {
      console.error("Erro durante a listagem de dietas:", error)
      return null
    }
  }
}
