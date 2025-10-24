import { Dieta } from "../../domain/entities/Dieta"

export interface IDIetaRepository {
  save(Dieta: Dieta): Promise<Dieta>
  indAllByNutricionistaId(idNutricionista: string): Promise<Dieta[]>
  findAll(): Promise<Dieta[]>
  findById(id: string): Promise<Dieta | null>
}
