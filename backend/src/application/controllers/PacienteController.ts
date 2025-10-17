import { CreatePacienteUseCase } from "../../domain/useCases/CreatePacienteUseCase";
import { ListPacientesUseCase } from "../../domain/useCases/ListPacientesUseCase";
import { IPacienteRepository } from "../interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../dtos/CriarPacienteDTO";
import { CriarPacienteResponseDTO } from "../dtos/CriarPacienteResponseDTO";
import { GetDadosPacienteUseCase } from "../../domain/useCases/GetDadosPacienteUseCase";
import { ConsultarPacienteDTO } from "../dtos/ConsultaPacienteDTO";
import { ConsultarPacienteResponseDTO } from "../dtos/ConsultarPacienteResponseDTO";
import { ListarPacientesDTO } from "../dtos/ListarPacientesDTO";
import { ListarPacientesResponseDTO } from "../dtos/ListarPacientesResponseDTO";

export class PacienteController {
  private createPacienteUseCase: CreatePacienteUseCase;
  private listPacientesUseCase: ListPacientesUseCase;
  private getDadosPaciente : GetDadosPacienteUseCase;

  constructor(pacienteRepo: IPacienteRepository) {
    this.createPacienteUseCase = new CreatePacienteUseCase(pacienteRepo);
    this.listPacientesUseCase = new ListPacientesUseCase(pacienteRepo);
    this.getDadosPaciente = new GetDadosPacienteUseCase(pacienteRepo);
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

  async consultarDados(
    dto: ConsultarPacienteDTO
  ): Promise<ConsultarPacienteResponseDTO> {
    const paciente = await this.getDadosPaciente.consultarDados(dto.id);
    return ConsultarPacienteResponseDTO.fromPaciente(paciente);
  }
}
