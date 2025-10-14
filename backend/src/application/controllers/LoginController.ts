import { LoginUseCase } from "../../domain/useCases/LoginUseCase";
import { LoginDTO } from "../dtos/LoginDTO";
import { ILoginRepository } from "../interfaces/ILoginRepository";
import { UserResponseDTO } from "../dtos/UserResponseDTO";

export class LoginController {
  private loginUseCase: LoginUseCase;

  constructor(loginRepo: ILoginRepository) {
    this.loginUseCase = new LoginUseCase(loginRepo);
  }

  async login(data: LoginDTO): Promise<UserResponseDTO> {
    const user = await this.loginUseCase.login(data);
    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }
    return UserResponseDTO.fromUser(user);
  }
}
