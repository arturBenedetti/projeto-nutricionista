import { Paciente } from "../../domain/entities/Paciente";

export class ConsultarPacienteResponseDTO {
    constructor(
        public readonly id: string,
        public readonly nome: string,
        public readonly sexo: string,
        public readonly email: string,
        public readonly dataNascimento: Date,
        public readonly peso: number,
        public readonly altura: number,
    ) { }

    static fromPaciente(paciente: Paciente | null): ConsultarPacienteResponseDTO {
        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }

        return new ConsultarPacienteResponseDTO(
            paciente.id,
            paciente.nome,
            paciente.sexo,
            paciente.email,
            paciente.dataNascimento,
            paciente.peso,
            paciente.altura,
        );
    }
}
