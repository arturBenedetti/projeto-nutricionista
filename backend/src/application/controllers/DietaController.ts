import { IDietaRepository } from "../interfaces/IDietaRepository"
import { CreateDietaUseCase } from "../../domain/useCases/CreateDietaUseCase"
import { CriarDietaDTO } from "../dtos/CriarDietaDTO"
import { CriarDietaResponseDTO } from "../dtos/ConsultarDietaResponseDTO"
import { ListDietasUseCase } from "../../domain/useCases/ListDietasUseCase"
import { ListarDietasDTO } from "../dtos/ListarDietasDTO"
import { ListarDietasResponseDTO } from "../dtos/ListarDietasResponseDTO"
import { GetDadosDietaUseCase } from "../../domain/useCases/GetDadosDietaUseCase"
import { ConsultarDietaDTO } from "../dtos/ConsultarDietaDTO"

export class DietaController {
  private createDietaUseCase: CreateDietaUseCase
  private listDietasUseCase: ListDietasUseCase
  private getDadosDieta: GetDadosDietaUseCase

  constructor(dietaRepo: IDietaRepository) {
    this.createDietaUseCase = new CreateDietaUseCase(dietaRepo)
    this.listDietasUseCase = new ListDietasUseCase(dietaRepo)
    this.getDadosDieta = new GetDadosDietaUseCase(dietaRepo)
  }

  async criarDieta(dto: CriarDietaDTO): Promise<CriarDietaResponseDTO | null> {
    return await this.createDietaUseCase.criarDieta(dto)
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
}
