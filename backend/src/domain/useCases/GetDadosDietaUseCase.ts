import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { ConsultarDietaDTO } from "../../application/dtos/ConsultarDietaDTO"
import { CriarDietaResponseDTO } from "../../application/dtos/ConsultarDietaResponseDTO"

export class GetDadosDietaUseCase {
  constructor(private dietaRepo: IDietaRepository) {}

  async consultarDados(id: string): Promise<CriarDietaResponseDTO> {
    const dieta = await this.dietaRepo.findById(id)
    return CriarDietaResponseDTO.fromDieta(dieta)
  }
}
