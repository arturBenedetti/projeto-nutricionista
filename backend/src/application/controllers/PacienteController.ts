import { CreatePacienteUseCase } from "../../domain/useCases/CreatePacienteUseCase";
import { ListPacientesUseCase } from "../../domain/useCases/ListPacientesUseCase";
import { IPacienteRepository } from "../interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../dtos/CriarPacienteDTO";
import { CriarPacienteResponseDTO } from "../dtos/CriarPacienteResponseDTO";
import { ListarPacientesDTO } from "../dtos/ListarPacientesDTO";
import { ListarPacientesResponseDTO } from "../dtos/ListarPacientesResponseDTO";

export class PacienteController {
  private createPacienteUseCase: CreatePacienteUseCase;
  private listPacientesUseCase: ListPacientesUseCase;

  constructor(pacienteRepo: IPacienteRepository) {
    this.createPacienteUseCase = new CreatePacienteUseCase(pacienteRepo);
    this.listPacientesUseCase = new ListPacientesUseCase(pacienteRepo);
  }

  async criarPaciente(
    dto: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO | null> {
    return await this.createPacienteUseCase.criarPaciente(dto);
  }

  async listarPacientes(
    dto: ListarPacientesDTO
  ): Promise<ListarPacientesResponseDTO | null> {
    return await this.listPacientesUseCase.listarPacientes(dto);
  }
}
