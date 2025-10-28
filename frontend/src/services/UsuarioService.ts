import { ref } from "vue";
import { UsuarioResponseDTO } from "../DTOs/UsuarioResponseDTO";
import { AuthService } from "./AuthService";

// Load user from localStorage on initialization using AuthService
const loadUserFromStorage = (): UsuarioResponseDTO | null => {
  return AuthService.getUser();
};

export const loggedUser = ref(loadUserFromStorage()); // Load from localStorage on init

export const setLoggedUser = (user: UsuarioResponseDTO | null) => {
  loggedUser.value = user;
};

export const setAuth = (user: UsuarioResponseDTO, token: string, expiresAt: Date) => {
  loggedUser.value = user;
  AuthService.setAuth(user, token, expiresAt);
};

export const getLoggedUser = () => {
  return loggedUser.value;
};

export const logout = () => {
  loggedUser.value = null;
  AuthService.clearAuth();
};

export const isAuthenticated = () => {
  return AuthService.isTokenValid() && loggedUser.value !== null;
};
