import { Paciente } from "../entities/Paciente";
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../../application/dtos/CriarPacienteDTO";
import { v4 as uuidv4 } from "uuid";
import { CriarPacienteResponseDTO } from "../../application/dtos/CriarPacienteResponseDTO";

export class CreatePacienteUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async criarPaciente(
    pacienteDTO: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO | null> {
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
      const novoPaciente = await this.pacienteRepo.save(paciente);
      return CriarPacienteResponseDTO.fromPaciente(novoPaciente);
    } catch (error) {
      console.error("Erro durante a criação de paciente:", error);
      return null;
    }
  }
}
