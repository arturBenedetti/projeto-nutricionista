import { User } from "../entities/User";
import { ILoginRepository } from "../../application/interfaces/ILoginRepository";
import { LoginDTO } from "../../application/dtos/LoginDTO";

export class LoginUseCase {
  constructor(private loginRepo: ILoginRepository) {}

  async login(data: LoginDTO): Promise<User | null> {
    try {
      return await this.loginRepo.findUserByCredentials(data);
    } catch (error) {
      console.error("Erro durante o login:", error);
      return null;
    }
  }
}
