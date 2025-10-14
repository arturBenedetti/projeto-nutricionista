import { Paciente } from "../entities/Paciente.js";
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository.js";

export class PacienteService {
  constructor(private pacienteRepo: IPacienteRepository) {}

    async getDadosPaciente(id: string): Promise<Paciente | null> {
        return await this.pacienteRepo.findById(id);
    }

}
