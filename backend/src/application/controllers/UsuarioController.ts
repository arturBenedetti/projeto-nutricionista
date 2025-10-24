import { CreateUserUseCase } from "../../domain/useCases/CreateUsuarioUseCase";
import { ListUsersUseCase } from "../../domain/useCases/ListUsersUseCase";
import { IUsuarioRepository } from "../interfaces/IUsuarioRepository";
import { CriarUsuarioDTO } from "../dtos/CriarUsuarioDTO";
import { UsuarioResponseDTO } from "../dtos/UsuarioResponseDTO";
import { IUsuarioService } from "../../domain/services/IUsuarioService";

export class UsuarioController {
  private createUser: CreateUserUseCase;
  private listUsers: ListUsersUseCase;

  constructor(userRepo: IUsuarioRepository, usuarioService: IUsuarioService) {
    this.createUser = new CreateUserUseCase(userRepo, usuarioService);
    this.listUsers = new ListUsersUseCase(userRepo);
  }

  async create(req: CriarUsuarioDTO): Promise<UsuarioResponseDTO | null> {
    const user = await this.createUser.execute(req);
    return UsuarioResponseDTO.fromUsuario(user);
  }

  async list(): Promise<(UsuarioResponseDTO | null)[]> {
    const users = await this.listUsers.execute();
    return users.map((user) => UsuarioResponseDTO.fromUsuario(user));
  }
}
