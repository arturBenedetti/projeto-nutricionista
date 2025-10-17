import { Paciente } from "../../domain/entities/Paciente";

export interface IPacienteRepository {
  save(Paciente: Paciente): Promise<Paciente>;
  findAllByNutricionistaId(idNutricionista: string): Promise<Paciente[]>;
  findAll(): Promise<Paciente[]>;
}
