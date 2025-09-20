import { User } from "../entities/User.js";
import { IUserRepository } from "../../application/interfaces/IUserRepository.js";

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async createUser(name: string, email: string): Promise<User> {
    const user = new User(Date.now().toString(), name, email);
    return await this.userRepo.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.findAll();
  }
}
