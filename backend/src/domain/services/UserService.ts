import { User } from "../entities/User.js";
import { IUserRepository } from "../../application/interfaces/IUserRepository.js";

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async createUser(
    name: string,
    email: string,
    user: string,
    password: string
  ): Promise<User> {
    const newUser = new User(
      Date.now().toString(),
      name,
      email,
      user,
      password
    );
    return await this.userRepo.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.findAll();
  }
}
