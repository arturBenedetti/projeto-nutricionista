import { CreateUserUseCase } from "../../domain/useCases/CreateUserUseCase";
import { ListUsersUseCase } from "../../domain/useCases/ListUsersUseCase";
import { IUserRepository } from "../interfaces/IUserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { UserResponseDTO } from "../dtos/UserResponseDTO";

export class UserController {
  private createUser: CreateUserUseCase;
  private listUsers: ListUsersUseCase;

  constructor(userRepo: IUserRepository) {
    this.createUser = new CreateUserUseCase(userRepo);
    this.listUsers = new ListUsersUseCase(userRepo);
  }

  async create(req: CreateUserDTO): Promise<UserResponseDTO> {
    const user = await this.createUser.execute(req);
    return UserResponseDTO.fromUser(user);
  }

  async list(): Promise<UserResponseDTO[]> {
    const users = await this.listUsers.execute();
    return users.map(user => UserResponseDTO.fromUser(user));
  }
}
