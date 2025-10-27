import { Usuario } from "../../domain/entities/Usuario";
import { LoginDTO } from "../dtos/LoginDTO";
import { ChangePasswordDTO } from "../dtos/ChangePasswordDTO";

export interface ILoginRepository {
  findUserByCredentials(data: LoginDTO): Promise<Usuario | null>;
  changePassword(data: ChangePasswordDTO): Promise<boolean>;
}
