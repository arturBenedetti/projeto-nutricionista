import { Usuario } from "../../domain/entities/Usuario";
import { CreateUsuarioModel } from "../../domain/models/CreateUsuarioModel";
import { IUsuarioService } from "../../domain/services/IUsuarioService";
import { IUsuarioRepository } from "../../application/interfaces/IUsuarioRepository";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export class UsuarioService implements IUsuarioService {
  constructor(private userRepo: IUsuarioRepository) {}

  async createUsuario(model: CreateUsuarioModel): Promise<Usuario | null> {
    //validar se pode criar usuário
    const usuarioExistente = await this.userRepo.findByEmail(model.email);
    if (usuarioExistente) {
      throw new Error("Usuário já cadastrado com este e-mail.");
    }

    const selfId = uuidv4();
    const hashedPassword = await bcrypt.hash(model.password, 12);
    const newUser = new Usuario(
      selfId,
      model.name,
      model.email,
      model.email,
      hashedPassword,
      //Se eh nutricionista, utiliza o proprio id como nutri
      model.isNutricionista ? selfId : model.idNutricionista,
      model.isPaciente,
      model.isNutricionista
    );
    return await this.userRepo.save(newUser);
  }
}
