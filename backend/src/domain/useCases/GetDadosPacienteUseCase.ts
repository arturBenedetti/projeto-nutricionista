import { Paciente } from "../entities/Paciente";
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";

export class GetDadosPacienteUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async consultarDados(id: string): Promise<Paciente | null> {
    try {
      return await this.pacienteRepo.findById(id);
    } catch (error) {
      console.error("Erro durante a busca do paciente:", error);
      return null;
    }
  }
}
