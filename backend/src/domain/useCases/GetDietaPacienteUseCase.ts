import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository"
import { CriarDietaResponseDTO } from "../../application/dtos/ConsultarDietaResponseDTO"

export class GetDietaPacienteUseCase {
  constructor(
    private dietaRepo: IDietaRepository,
    private pacienteRepo: IPacienteRepository
  ) {}

  async buscarDietaValida(idUsuario: string): Promise<CriarDietaResponseDTO | null> {
    try {
      // Primeiro, busca o paciente pelo idUsuario
      const paciente = await this.pacienteRepo.findByUsuarioId(idUsuario)
      if (!paciente) {
        return null
      }

      // Busca todas as dietas do paciente
      const dietas = await this.dietaRepo.findAllByPacienteId(paciente.id)

      // Filtra dietas válidas (data atual entre dataInicio e dataFim)
      const dataAtual = new Date()
      dataAtual.setHours(0, 0, 0, 0) // Remove horas para comparar apenas datas

      const dietaValida = dietas.find((dieta) => {
        const dataInicio = new Date(dieta.dataInicio)
        dataInicio.setHours(0, 0, 0, 0)
        const dataFim = new Date(dieta.dataFim)
        dataFim.setHours(23, 59, 59, 999) // Inclui o dia inteiro

        return dataAtual >= dataInicio && dataAtual <= dataFim
      })

      if (!dietaValida) {
        return null
      }

      return CriarDietaResponseDTO.fromDieta(dietaValida)
    } catch (error) {
      console.error("Erro durante a busca da dieta do paciente:", error)
      return null
    }
  }
}



