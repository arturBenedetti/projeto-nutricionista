import { ref } from "vue";
import { UsuarioResponseDTO } from "../DTOs/UsuarioResponseDTO";

export const loggedUser = ref(); // Store the logged-in user's ID

export const setLoggedUser = (user: UsuarioResponseDTO | null) => {
  loggedUser.value = user;
};

export const getLoggedUser = () => {
  return loggedUser.value;
};
