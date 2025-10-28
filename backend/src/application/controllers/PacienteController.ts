import { IPacienteRepository } from "../interfaces/IPacienteRepository";
import { CreatePacienteUseCase } from "../../domain/useCases/CreatePacienteUseCase";
import { EditarPacienteUseCase } from "../../domain/useCases/EditarPacienteUseCase";
import { EditarPacienteDTO } from "../dtos/EditarPacienteDTO";
import { CriarPacienteDTO } from "../dtos/CriarPacienteDTO";
import { CriarPacienteResponseDTO } from "../dtos/CriarPacienteResponseDTO";
import { ListPacientesUseCase } from "../../domain/useCases/ListPacientesUseCase";
import { ListarPacientesDTO } from "../dtos/ListarPacientesDTO";
import { ListarPacientesResponseDTO } from "../dtos/ListarPacientesResponseDTO";
import { GetDadosPacienteUseCase } from "../../domain/useCases/GetDadosPacienteUseCase";
import { ExcluirPacienteUseCase } from "../../domain/useCases/ExcluirPacienteUseCase";
import { ConsultarPacienteDTO } from "../dtos/ConsultaPacienteDTO";
import { ConsultarPacienteResponseDTO } from "../dtos/ConsultarPacienteResponseDTO";
import { ExcluirPacienteDTO } from "../dtos/ExcluirPacienteDTO";
import { IUsuarioService } from "../../domain/services/IUsuarioService";

export class PacienteController {
  private createPacienteUseCase: CreatePacienteUseCase;
  private editarPacienteUseCase: EditarPacienteUseCase;
  private listPacientesUseCase: ListPacientesUseCase;
  private getDadosPacienteUseCase: GetDadosPacienteUseCase;
  private excluirPacienteUseCase: ExcluirPacienteUseCase;

  constructor(
    pacienteRepo: IPacienteRepository,
    usuarioService: IUsuarioService
  ) {
    this.createPacienteUseCase = new CreatePacienteUseCase(
      pacienteRepo,
      usuarioService
    );
    this.editarPacienteUseCase = new EditarPacienteUseCase(pacienteRepo);
    this.listPacientesUseCase = new ListPacientesUseCase(pacienteRepo);
    this.getDadosPacienteUseCase = new GetDadosPacienteUseCase(pacienteRepo);
    this.excluirPacienteUseCase = new ExcluirPacienteUseCase(pacienteRepo);
  }

  async criarPaciente(
    dto: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO | null> {
    return await this.createPacienteUseCase.criarPaciente(dto);
  }

  async editarPaciente(dto: EditarPacienteDTO) {
    await this.editarPacienteUseCase.editarPaciente(dto);
  }

  async listarPacientes(
    dto: ListarPacientesDTO
  ): Promise<ListarPacientesResponseDTO | null> {
    return await this.listPacientesUseCase.listarPacientes(dto);
  }

  async consultarDados(
    dto: ConsultarPacienteDTO
  ): Promise<ConsultarPacienteResponseDTO> {
    const paciente = await this.getDadosPacienteUseCase.consultarDados(dto.id);
    return ConsultarPacienteResponseDTO.fromPaciente(paciente);
  }

  async excluirPaciente(dto: ExcluirPacienteDTO): Promise<boolean> {
    return await this.excluirPacienteUseCase.excluirPaciente(dto);
  }
}
