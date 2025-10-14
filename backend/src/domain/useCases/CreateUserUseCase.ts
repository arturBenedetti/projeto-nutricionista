import { User } from "../entities/User";
import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { CreateUserDTO } from "../../application/dtos/CreateUserDTO";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class CreateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Hash da senha com salt rounds = 12
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const newUser = new User(
      uuidv4(), // Usar UUID ao invés de timestamp
      data.name,
      data.email,
      data.user,
      hashedPassword
    );
    return await this.userRepo.save(newUser);
  }
}
