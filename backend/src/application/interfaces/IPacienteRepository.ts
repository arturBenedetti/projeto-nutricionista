import { Paciente } from "../../domain/entities/Paciente";

export interface IPacienteRepository {
  save(Paciente: Paciente): Promise<Paciente>;
  findAll(idNutricionista: string): Promise<Paciente[]>;
}
