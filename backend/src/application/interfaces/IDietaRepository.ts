import { Dieta } from "../../domain/entities/Dieta"

export interface IDietaRepository {
  save(dieta: Dieta): Promise<Dieta>
  findAllByNutricionistaId(idNutricionista: string): Promise<Dieta[]>
  findAllByPacienteId(idPaciente: string): Promise<Dieta[]>
  findAll(): Promise<Dieta[]>
  findById(id: string): Promise<Dieta | null>
  update(id: string, dieta: Partial<Dieta>): Promise<Dieta | null>
  delete(id: string): Promise<boolean>
}
