import { User } from "../entities/User";
import { IUserRepository } from "../../application/interfaces/IUserRepository";

export class ListUsersUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepo.findAll();
  }
}
