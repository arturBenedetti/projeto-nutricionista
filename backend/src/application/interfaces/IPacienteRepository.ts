import { Paciente } from "../../domain/entities/Paciente";
import { EvolutionImagesModel } from "../../domain/models/EvolutionImagesModel";

export interface IPacienteRepository {
  save(Paciente: Paciente): Promise<Paciente>;
  update(Paciente: Paciente): Promise<Paciente>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Paciente[]>;
  findById(id: string): Promise<Paciente | null>;
  findAllByNutricionistaId(idNutricionista: string): Promise<Paciente[]>;
  findByUsuarioId(id: string): Promise<Paciente | null>;
}
