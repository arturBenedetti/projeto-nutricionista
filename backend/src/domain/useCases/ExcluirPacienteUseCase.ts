import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { ExcluirPacienteDTO } from "../../application/dtos/ExcluirPacienteDTO";

export class ExcluirPacienteUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async excluirPaciente(dto: ExcluirPacienteDTO): Promise<boolean> {
    try {
      // Verificar se o paciente existe
      const paciente = await this.pacienteRepo.findById(dto.id);
      if (!paciente) {
        throw new Error("Paciente não encontrado");
      }

      // Excluir o paciente
      const sucesso = await this.pacienteRepo.delete(dto.id);
      return sucesso;
    } catch (error) {
      console.error("Erro durante a exclusão de paciente:", error);
      throw error;
    }
  }
}
