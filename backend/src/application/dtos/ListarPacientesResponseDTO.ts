import { Paciente } from "../../domain/entities/Paciente";

export class ListarPacientesResponseDTO {
  public readonly pacientes: PacienteDTO[];

  constructor(pacientes: PacienteDTO[]) {
    this.pacientes = pacientes;
  }

  static mapFromPacienteArray(
    pacientes: Paciente[]
  ): ListarPacientesResponseDTO {
    const listaPacientes: PacienteDTO[] = pacientes.map(
      (paciente) =>
        new PacienteDTO(
          paciente.id,
          paciente.idNutricionista,
          paciente.nome,
          paciente.sexo,
          paciente.email,
          paciente.dataNascimento,
          paciente.peso,
          paciente.altura,
          paciente.anamnese
        )
    );

    return new ListarPacientesResponseDTO(listaPacientes);
  }
}

export class PacienteDTO {
  constructor(
    public readonly id: string,
    public idNutricionista: string,
    public nome: string,
    public sexo: string,
    public email: string,
    public dataNascimento: Date,
    public peso: number,
    public altura: number,
    public anamnese: string
  ) {}
}
