import { Paciente } from "../../domain/entities/Paciente";

export class CriarPacienteResponseDTO {
  constructor(
    public readonly id: string,
    public readonly idUsuario: string,
    public readonly idNutricionista: string,
    public readonly nome: string,
    public readonly sexo: string,
    public readonly email: string,
    public readonly dataNascimento: Date,
    public readonly peso: number,
    public readonly altura: number,
    public readonly anamnese: string
  ) {}

  static fromPaciente(paciente: Paciente | null): CriarPacienteResponseDTO {
    if (!paciente) {
      throw new Error("Paciente não encontrado");
    }

    return new CriarPacienteResponseDTO(
      paciente.id,
      paciente.idUsuario,
      paciente.idNutricionista,
      paciente.nome,
      paciente.sexo,
      paciente.email,
      paciente.dataNascimento,
      paciente.peso,
      paciente.altura,
      paciente.anamnese
    );
  }
}
