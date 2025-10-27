import { UsuarioResponseDTO } from "../DTOs/UsuarioResponseDTO";

export class LoginResponseDTO{
  constructor(
    user: UsuarioResponseDTO | null,
    token: string,
    expiresAt: string // ISO string
  ) {}
}

// Storage keys
const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";
const STORAGE_KEY_EXPIRES_AT = "auth_expires_at";

export class AuthService {
  /**
   * Saves authentication data (user, token, expiration)
   */
  static setAuth(user: UsuarioResponseDTO, token: string, expiresAt: Date): void {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_EXPIRES_AT, expiresAt.toISOString());
  }

  /**
   * Gets the current user from storage
   */
  static getUser(): UsuarioResponseDTO | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return new UsuarioResponseDTO(
        parsed.id,
        parsed.name,
        parsed.email,
        parsed.user,
        parsed.idNutricionista,
        parsed.isNutricionista,
        parsed.isPaciente
      );
    } catch (error) {
      console.error("Error loading user from storage:", error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Gets the authentication token
   */
  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  }

  /**
   * Gets the expiration date
   */
  static getExpiresAt(): Date | null {
    const stored = localStorage.getItem(STORAGE_KEY_EXPIRES_AT);
    if (!stored) return null;
    return new Date(stored);
  }

  /**
   * Checks if the current token is valid and not expired
   */
  static isTokenValid(): boolean {
    const token = this.getToken();
    const expiresAt = this.getExpiresAt();
    
    if (!token || !expiresAt) return false;
    
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    
    // Check if token is still valid (with 1 minute buffer)
    return now < new Date(expiryDate.getTime() - 60000);
  }

  /**
   * Clears all authentication data
   */
  static clearAuth(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_EXPIRES_AT);
  }
}

