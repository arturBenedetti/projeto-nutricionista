import { User } from "../../domain/entities/User";

export class UserResponseDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly user: string
  ) {}

  // Método estático para criar DTO a partir da entidade User
  static fromUser(user: User): UserResponseDTO {
    return new UserResponseDTO(
      user.id,
      user.name,
      user.email,
      user.user
    );
  }
}
