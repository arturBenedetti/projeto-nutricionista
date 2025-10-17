import { Usuario } from "../entities/Usuario";
import { IUsuarioRepository } from "../../application/interfaces/IUsuarioRepository";

export class ListUsersUseCase {
  constructor(private usuarioRepo: IUsuarioRepository) {}

  async execute(): Promise<Usuario[]> {
    return await this.usuarioRepo.findAll();
  }
}
