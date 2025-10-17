import { ILoginRepository } from "../../application/interfaces/ILoginRepository";
import { Usuario } from "../../domain/entities/Usuario";
import { LoginDTO } from "../../application/dtos/LoginDTO";
import { Collection, Db } from "mongodb";
import bcrypt from "bcrypt";

export class LoginRepository implements ILoginRepository {
  private collection: Collection<Usuario>;

  constructor(db: Db) {
    this.collection = db.collection<Usuario>("users");
  }

  async findUserByCredentials(data: LoginDTO): Promise<Usuario | null> {
    // Buscar usuário apenas pelo username/email
    const user = await this.collection.findOne({
      $or: [{ user: data.user }, { email: data.user }],
    });

    if (!user) {
      return null;
    }

    // Verificar se a senha está correta usando bcrypt
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return new Usuario(
      user._id.toString(),
      user.name,
      user.email,
      user.user,
      user.password, // Em produção, considere não retornar a senha
      user.idNutricionista,
      user.isNutricionista,
      user.isPaciente
    );
  }
}
