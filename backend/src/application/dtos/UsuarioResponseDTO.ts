import { Usuario } from "../../domain/entities/Usuario";

export class UsuarioResponseDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly user: string,
    public readonly idNutricionista: string,
    public readonly isPaciente: boolean,
    public readonly isNutricionista: boolean
  ) {}

  // Método estático para criar DTO a partir da entidade User
  static fromUsuario(user: Usuario | null): UsuarioResponseDTO | null {
    if (!user) {
      return null;
    }

    return new UsuarioResponseDTO(
      user.id,
      user.name,
      user.email,
      user.user,
      user.idNutricionista,
      user.isNutricionista,
      user.isPaciente
    );
  }
}
