import { CreateUserUseCase } from "../../domain/useCases/CreateUserUseCase";
import { ListUsersUseCase } from "../../domain/useCases/ListUsersUseCase";
import { IUserRepository } from "../interfaces/IUserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class UserController {
  private createUser: CreateUserUseCase;
  private listUsers: ListUsersUseCase;

  constructor(userRepo: IUserRepository) {
    this.createUser = new CreateUserUseCase(userRepo);
    this.listUsers = new ListUsersUseCase(userRepo);
  }

  async create(req: CreateUserDTO) {
    return await this.createUser.execute(req);
  }

  async list() {
    return await this.listUsers.execute();
  }
}
