import { CreatePacienteUseCase } from "../../domain/useCases/CreatePacienteUseCase";
import { IPacienteRepository } from "../interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../dtos/CriarPacienteDTO";
import { CriarPacienteResponseDTO } from "../dtos/CriarPacienteResponseDTO";
import { GetDadosPacienteUseCase } from "../../domain/useCases/GetDadosPacienteUseCase";
import { ConsultarPacienteDTO } from "../dtos/ConsultaPacienteDTO";
import { ConsultarPacienteResponseDTO } from "../dtos/ConsultarPacienteResponseDTO";

export class PacienteController {
  private createPaciente: CreatePacienteUseCase;
  private getDadosPaciente : GetDadosPacienteUseCase;

  constructor(pacienteRepo: IPacienteRepository) {
    this.createPaciente = new CreatePacienteUseCase(pacienteRepo);
    this.getDadosPaciente = new GetDadosPacienteUseCase(pacienteRepo);
  }

  async criarPaciente(
    dto: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO> {
    const paciente = await this.createPaciente.criarPaciente(dto);
    return CriarPacienteResponseDTO.fromPaciente(paciente);
  }

  async consultarDados(
    dto: ConsultarPacienteDTO
  ): Promise<ConsultarPacienteResponseDTO> {
    const paciente = await this.getDadosPaciente.consultarDados(dto.id);
    return ConsultarPacienteResponseDTO.fromPaciente(paciente);
  }
}
