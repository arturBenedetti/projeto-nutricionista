import { Paciente } from "../entities/Paciente";
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../../application/dtos/CriarPacienteDTO";
import { v4 as uuidv4 } from "uuid";

export class CreatePacienteUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async criarPaciente(pacienteDTO: CriarPacienteDTO): Promise<Paciente | null> {
    try {
      const paciente = new Paciente(
        uuidv4(),
        pacienteDTO.idNutricionista,
        pacienteDTO.nome,
        pacienteDTO.sexo,
        pacienteDTO.email,
        pacienteDTO.dataNascimento,
        pacienteDTO.peso,
        pacienteDTO.altura,
        pacienteDTO.anamnese
      );

      return await this.pacienteRepo.save(paciente);
    } catch (error) {
      console.error("Erro durante a criação de paciente:", error);
      return null;
    }
  }
}
