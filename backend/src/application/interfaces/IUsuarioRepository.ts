import { Usuario } from "../../domain/entities/Usuario";

export interface IUsuarioRepository {
  save(usuario: Usuario): Promise<Usuario>;
  findAll(): Promise<Usuario[]>;
}
