import { Paciente } from "../entities/Paciente";
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { EditarPacienteDTO } from "../../application/dtos/EditarPacienteDTO";

export class EditarPacienteUseCase {
  constructor(
    private pacienteRepo: IPacienteRepository,    
  ) {}

  async editarPaciente(
    pacienteDTO: EditarPacienteDTO
  ){
    try {
      this.pacienteRepo.update(
        new Paciente(
          pacienteDTO.id,
          "",
          "",
          pacienteDTO.nome,
          pacienteDTO.sexo,
          pacienteDTO.email,
          pacienteDTO.dataNascimento,
          pacienteDTO.peso,
          pacienteDTO.altura,
          pacienteDTO.anamnese
        )
      );    
    } catch (error) {
      console.error("Erro durante a criação de paciente:", error);
      return null;
    }
  }
}
