import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { ListarPacientesResponseDTO } from "../../application/dtos/ListarPacientesResponseDTO";
import { ListarPacientesDTO } from "../../application/dtos/ListarPacientesDTO";

export class ListPacientesUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async listarPacientes(
    dto: ListarPacientesDTO
  ): Promise<ListarPacientesResponseDTO | null> {
    try {
      const pacientes = await this.pacienteRepo.findAllByNutricionistaId(
        dto.idNutricionista
      );

      return ListarPacientesResponseDTO.mapFromPacienteArray(pacientes);
    } catch (error) {
      console.error("Erro durante a listagem de pacientes:", error);
      return null;
    }
  }
}
