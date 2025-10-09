import { User } from "../entities/User";
import { ILoginRepository } from "../../application/interfaces/ILoginRepository";
import { LoginDTO } from "../../application/dtos/LoginDTO";

export class LoginUseCase {
  constructor(private loginRepo: ILoginRepository) {}

  async login(data: LoginDTO): Promise<User | null> {
    console.log(data);
    return await this.loginRepo.findUserByCredentials(data);
  }
}
