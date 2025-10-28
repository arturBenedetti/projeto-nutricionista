import { Dieta } from "../entities/Dieta"
import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { CriarDietaDTO } from "../../application/dtos/CriarDietaDTO"
import { v4 as uuidv4 } from "uuid"
import { CriarDietaResponseDTO } from "../../application/dtos/ConsultarDietaResponseDTO"

export class CreateDietaUseCase {
  constructor(private dietaRepo: IDietaRepository) {}

  async criarDieta(
    dietaDTO: CriarDietaDTO
  ): Promise<CriarDietaResponseDTO | null> {
    try {
      const dieta = new Dieta(
        uuidv4(),
        dietaDTO.idNutricionista,
        dietaDTO.idPaciente,
        new Date(dietaDTO.dataInicio),
        new Date(dietaDTO.dataFim),
        dietaDTO.descricao,
        dietaDTO.observacoes
      )

      const novaDieta = await this.dietaRepo.save(dieta)
      return CriarDietaResponseDTO.fromDieta(novaDieta)
    } catch (error) {
      console.error("Erro durante a criação de dieta:", error)
      return null
    }
  }
}
