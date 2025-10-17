import { Usuario } from "../entities/Usuario";
import { IUsuarioRepository } from "../../application/interfaces/IUsuarioRepository";
import { CriarUsuarioDTO } from "../../application/dtos/CriarUsuarioDTO";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class CreateUserUseCase {
  constructor(private userRepo: IUsuarioRepository) {}

  async execute(data: CriarUsuarioDTO): Promise<Usuario> {
    // Hash da senha com salt rounds = 12
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const selfId = uuidv4();

    const newUser = new Usuario(
      selfId,
      data.name,
      data.email,
      data.user,
      hashedPassword,
      data.isPaciente ? selfId : "", //Se o nutricionista deseja utilizar o sistema como paciente
      data.isPaciente,
      true
    );
    return await this.userRepo.save(newUser);
  }
}
