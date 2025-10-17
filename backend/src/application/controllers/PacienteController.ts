import { CreatePacienteUseCase } from "../../domain/useCases/CreatePacienteUseCase";
import { IPacienteRepository } from "../interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../dtos/CriarPacienteDTO";
import { CriarPacienteResponseDTO } from "../dtos/CriarPacienteResponseDTO";

export class PacienteController {
  private createPacienteUseCase: CreatePacienteUseCase;

  constructor(pacienteRepo: IPacienteRepository) {
    this.createPacienteUseCase = new CreatePacienteUseCase(pacienteRepo);
  }

  async criarPaciente(
    dto: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO | null> {
    return await this.createPacienteUseCase.criarPaciente(dto);
  }
}
