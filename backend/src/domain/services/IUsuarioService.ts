import { Usuario } from "../../domain/entities/Usuario.js";

import { CreateUsuarioModel } from "../../domain/models/CreateUsuarioModel.js";

export interface IUsuarioService {
  createUsuario(usuario: CreateUsuarioModel): Promise<Usuario | null>;
}
