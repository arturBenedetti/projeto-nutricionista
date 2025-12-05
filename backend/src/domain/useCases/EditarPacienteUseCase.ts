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
      // Busca o paciente existente para preservar as fotos de evolução
      const pacienteExistente = await this.pacienteRepo.findById(pacienteDTO.id);
      if (!pacienteExistente) {
        throw new Error("Paciente não encontrado");
      }

      await this.pacienteRepo.update(
        new Paciente(
          pacienteDTO.id,
          pacienteExistente.idUsuario,
          pacienteExistente.idNutricionista,
          pacienteDTO.nome,
          pacienteDTO.sexo,
          pacienteDTO.email,
          pacienteDTO.dataNascimento,
          pacienteDTO.peso,
          pacienteDTO.altura,
          pacienteDTO.anamnese,
          pacienteExistente.fotosEvolucao || [] // Preserva as fotos de evolução existentes
        )
      );    
    } catch (error) {
      console.error("Erro durante a edição de paciente:", error);
      throw error;
    }
  }
}
