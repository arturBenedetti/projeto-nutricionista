import { Alimento } from "../../domain/entities/Alimento";

export interface IAlimentoRepository {
  insertMany(alimentos: Alimento[]): Promise<void>;
  findByCategoria(categoriaId: string): Promise<Alimento[]>;
  searchByNome(termo: string): Promise<Alimento[]>;
}
