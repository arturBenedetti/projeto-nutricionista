import { LoginUseCase } from "../../domain/useCases/LoginUseCase";
import { LoginDTO } from "../dtos/LoginDTO";
import { ChangePasswordDTO } from "../dtos/ChangePasswordDTO";
import { ILoginRepository } from "../interfaces/ILoginRepository";
import { UsuarioResponseDTO } from "../dtos/UsuarioResponseDTO";
import { LoginResponseDTO } from "../dtos/LoginResponseDTO";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/env";

export class LoginController {
  private loginUseCase: LoginUseCase;

  constructor(loginRepo: ILoginRepository) {
    this.loginUseCase = new LoginUseCase(loginRepo);
  }

  async login(data: LoginDTO): Promise<LoginResponseDTO | null> {
    const user = await this.loginUseCase.login(data);
    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    const secret = String(config.JWT_SECRET);
    const expiration = String(config.JWT_EXPIRATION);
    
    if (!secret || secret === "") {
      throw new Error("JWT_SECRET não configurado");
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        isNutricionista: user.isNutricionista 
      },
      secret as any,
      { expiresIn: expiration as any }
    );

    // Parse expiresIn to milliseconds (e.g., "24h" = 24 * 60 * 60 * 1000)
    const expiresInMs = this.parseExpirationToMs(expiration);
    
    return new LoginResponseDTO(
      UsuarioResponseDTO.fromUsuario(user),
      token,
      new Date(Date.now() + expiresInMs)
    );
  }
  changePassword(data: ChangePasswordDTO): Promise<boolean> {
    return this.loginUseCase.changePassword(data);
  }

  private parseExpirationToMs(expiration: string): number {
    const match = expiration.match(/^(\d+)([dhms])$/);
    if (!match) return 24 * 60 * 60 * 1000; // default 24h
    
    const value = match[1];
    const unit = match[2];
    
    if (!value || !unit) return 24 * 60 * 60 * 1000;
    
    const multipliers: Record<string, number> = {
      d: 24 * 60 * 60 * 1000,
      h: 60 * 60 * 1000,
      m: 60 * 1000,
      s: 1000,
    };
    
    const multiplier = multipliers[unit];
    if (!multiplier) {
      throw new Error(`Unidade de tempo inválida: ${unit}`);
    }
    return parseInt(value) * multiplier;
  }
}
