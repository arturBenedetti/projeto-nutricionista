import { Paciente } from "../entities/Paciente";
import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { CriarPacienteDTO } from "../../application/dtos/CriarPacienteDTO";
import { v4 as uuidv4 } from "uuid";
import { CriarPacienteResponseDTO } from "../../application/dtos/CriarPacienteResponseDTO";
import { IUsuarioService } from "../../domain/services/IUsuarioService";

export class CreatePacienteUseCase {
  constructor(
    private pacienteRepo: IPacienteRepository,
    private usuarioService: IUsuarioService
  ) {}

  async criarPaciente(
    pacienteDTO: CriarPacienteDTO
  ): Promise<CriarPacienteResponseDTO | null> {
    try {
      const user: string =
        pacienteDTO.email.trim().split("@")[0] || pacienteDTO.email;

      const usuario = await this.usuarioService.createUsuario({
        idNutricionista: pacienteDTO.idNutricionista,
        name: pacienteDTO.nome,
        email: pacienteDTO.email,
        user: user,
        password: user,
        isPaciente: true,
        isNutricionista: false,
      });

      const paciente = new Paciente(
        uuidv4(),
        usuario?.id || "",
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
