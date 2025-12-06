import { IDietaRepository } from "../interfaces/IDietaRepository"
import { IPacienteRepository } from "../interfaces/IPacienteRepository"
import { CreateDietaUseCase } from "../../domain/useCases/CreateDietaUseCase"
import { UpdateDietaUseCase } from "../../domain/useCases/UpdateDietaUseCase"
import { DeleteDietaUseCase } from "../../domain/useCases/DeleteDietaUseCase"
import { GetDietaPacienteUseCase } from "../../domain/useCases/GetDietaPacienteUseCase"
import { CriarDietaDTO } from "../dtos/CriarDietaDTO"
import { AtualizarDietaDTO } from "../dtos/AtualizarDietaDTO"
import { BuscarDietaPacienteDTO } from "../dtos/BuscarDietaPacienteDTO"
import { CriarDietaResponseDTO } from "../dtos/ConsultarDietaResponseDTO"
import { ListDietasUseCase } from "../../domain/useCases/ListDietasUseCase"
import { ListarDietasDTO } from "../dtos/ListarDietasDTO"
import { ListarDietasResponseDTO } from "../dtos/ListarDietasResponseDTO"
import { GetDadosDietaUseCase } from "../../domain/useCases/GetDadosDietaUseCase"
import { ConsultarDietaDTO } from "../dtos/ConsultarDietaDTO"

export class DietaController {
  private createDietaUseCase: CreateDietaUseCase
  private updateDietaUseCase: UpdateDietaUseCase
  private deleteDietaUseCase: DeleteDietaUseCase
  private getDietaPacienteUseCase: GetDietaPacienteUseCase
  private listDietasUseCase: ListDietasUseCase
  private getDadosDieta: GetDadosDietaUseCase

  constructor(dietaRepo: IDietaRepository, pacienteRepo: IPacienteRepository) {
    this.createDietaUseCase = new CreateDietaUseCase(dietaRepo)
    this.updateDietaUseCase = new UpdateDietaUseCase(dietaRepo)
    this.deleteDietaUseCase = new DeleteDietaUseCase(dietaRepo)
    this.getDietaPacienteUseCase = new GetDietaPacienteUseCase(dietaRepo, pacienteRepo)
    this.listDietasUseCase = new ListDietasUseCase(dietaRepo)
    this.getDadosDieta = new GetDadosDietaUseCase(dietaRepo)
  }

  async criarDieta(dto: CriarDietaDTO): Promise<CriarDietaResponseDTO | null> {
    return await this.createDietaUseCase.criarDieta(dto)
  }

  async atualizarDieta(dto: AtualizarDietaDTO): Promise<CriarDietaResponseDTO | null> {
    return await this.updateDietaUseCase.atualizarDieta(dto)
  }

  async excluirDieta(id: string): Promise<boolean> {
    return await this.deleteDietaUseCase.excluirDieta(id)
  }

  async listarDietas(
    dto: ListarDietasDTO
  ): Promise<ListarDietasResponseDTO | null> {
    return await this.listDietasUseCase.listarDietas(dto)
  }

  async consultarDados(dto: ConsultarDietaDTO): Promise<CriarDietaResponseDTO> {
    const dieta = await this.getDadosDieta.consultarDados(dto.id)
    return dieta
  }

  async buscarDietaPaciente(dto: BuscarDietaPacienteDTO): Promise<CriarDietaResponseDTO | null> {
    return await this.getDietaPacienteUseCase.buscarDietaValida(dto.idUsuario)
  }
}
