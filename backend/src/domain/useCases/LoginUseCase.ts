import { Usuario } from "../entities/Usuario";
import { ILoginRepository } from "../../application/interfaces/ILoginRepository";
import { LoginDTO } from "../../application/dtos/LoginDTO";
import { ChangePasswordDTO } from "../../application/dtos/ChangePasswordDTO";

export class LoginUseCase {
  constructor(private loginRepo: ILoginRepository) {}

  async login(data: LoginDTO): Promise<Usuario | null> {
    try {
      return await this.loginRepo.findUserByCredentials(data);
    } catch (error) {
      console.error("Erro durante o login:", error);
      return null;
    }
  }

  async changePassword(data: ChangePasswordDTO): Promise<boolean> {
    try {
      return await this.loginRepo.changePassword(data);
    } catch (error) {
      console.error("Erro durante a mudança de senha:", error);
      return false;
    }
  }
}
