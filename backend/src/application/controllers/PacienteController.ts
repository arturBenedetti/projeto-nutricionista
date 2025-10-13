import { CreatePacienteUseCase } from "../../domain/useCases/CreatePacienteUseCase";
import { IPacienteRepository } from "../interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../dtos/CriarPacienteDTO";
import { CriarPacienteResponseDTO } from "../dtos/CriarPacienteResponseDTO";

export class PacienteController {
  private createPaciente: CreatePacienteUseCase;

  constructor(pacienteRepo: IPacienteRepository) {
    this.createPaciente = new CreatePacienteUseCase(pacienteRepo);
  }

  async criarPaciente(
    dto: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO> {
    const paciente = await this.createPaciente.criarPaciente(dto);
    return CriarPacienteResponseDTO.fromPaciente(paciente);
  }
}
