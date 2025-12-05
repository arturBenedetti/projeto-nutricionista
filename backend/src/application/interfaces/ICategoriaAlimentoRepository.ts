import { CategoriaAlimento } from "../../domain/entities/CategoriaAlimento";

export interface ICategoriaAlimentoRepository {
  insertMany(categorias: CategoriaAlimento[]): Promise<void>;
  findAll(): Promise<CategoriaAlimento[]>;
  findByNome(nome: string): Promise<CategoriaAlimento | null>;
}
