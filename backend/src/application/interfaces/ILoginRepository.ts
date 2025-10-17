import { Usuario } from "../../domain/entities/Usuario";
import { LoginDTO } from "../dtos/LoginDTO";

export interface ILoginRepository {
  findUserByCredentials(data: LoginDTO): Promise<Usuario | null>;
}
