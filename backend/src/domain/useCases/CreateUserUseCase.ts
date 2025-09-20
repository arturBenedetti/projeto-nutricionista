import { User } from "../entities/User";
import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { CreateUserDTO } from "../../application/dtos/CreateUserDTO";

export class CreateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const user = new User(Date.now().toString(), data.name, data.email);
    return await this.userRepo.save(user);
  }
}
