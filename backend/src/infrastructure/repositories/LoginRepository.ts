import { ILoginRepository } from "../../application/interfaces/ILoginRepository";
import { Usuario } from "../../domain/entities/Usuario";
import { LoginDTO } from "../../application/dtos/LoginDTO";
import { ChangePasswordDTO } from "../../application/dtos/ChangePasswordDTO";
import { Collection, Db } from "mongodb";
import bcrypt from "bcrypt";

interface UsuarioDocument {
  _id: string;
  name: string;
  email: string;
  user: string;
  password: string;
  idNutricionista: string;
  isPaciente: boolean;
  isNutricionista: boolean;
}

export class LoginRepository implements ILoginRepository {
  private collection: Collection<UsuarioDocument>;

  constructor(db: Db) {
    this.collection = db.collection<UsuarioDocument>("users");
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
  
  async changePassword(data: ChangePasswordDTO): Promise<boolean> {
    const user = await this.collection.findOne({ _id: data.id });
    if (!user) {
      return false;
    }
    const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
    if (!isPasswordValid) {
      return false;
    }
    const newPassword = await bcrypt.hash(data.newPassword, 12);
    await this.collection.updateOne({ _id: data.id }, { $set: { password: newPassword } });
    return true;
  }
}
