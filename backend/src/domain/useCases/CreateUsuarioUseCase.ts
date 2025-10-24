import { Usuario } from "../entities/Usuario";
import { IUsuarioRepository } from "../../application/interfaces/IUsuarioRepository";
import { CriarUsuarioDTO } from "../../application/dtos/CriarUsuarioDTO";
import { IUsuarioService } from "../services/IUsuarioService";

export class CreateUserUseCase {
  constructor(
    private userRepo: IUsuarioRepository,
    private usuarioService: IUsuarioService
  ) {}

  async execute(dto: CriarUsuarioDTO): Promise<Usuario | null> {
    const newUser = await this.usuarioService.createUsuario({
      idNutricionista: "",
      name: dto.name,
      email: dto.email,
      user: dto.user,
      password: dto.password,
      isPaciente: dto.isPaciente,
      isNutricionista: true,
    });   
    
    return await newUser;
  }
}
