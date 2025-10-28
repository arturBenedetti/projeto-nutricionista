import { UsuarioResponseDTO } from "./UsuarioResponseDTO";

export class LoginResponseDTO {
  constructor(
    public readonly user: UsuarioResponseDTO | null,
    public readonly token: string,
    public readonly expiresAt: Date
  ) {}
}