import { User } from "../../../src/domain/entities/User";
import { LoginDTO } from "../dtos/LoginDTO";

export interface ILoginRepository {
  findUserByCredentials(data: LoginDTO): Promise<User | null>;
}
