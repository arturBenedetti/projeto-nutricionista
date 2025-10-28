export class UsuarioResponseDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly user: string;
  public readonly idNutricionista: string;
  public readonly isNutricionista: boolean;
  public readonly isPaciente: boolean;

  constructor(
    id: string,
    name: string,
    email: string,
    user: string,
    idNutricionista: string,
    isNutricionista: boolean,
    isPaciente: boolean
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.user = user;
    this.idNutricionista = idNutricionista;
    this.isNutricionista = isNutricionista;
    this.isPaciente = isPaciente;
  }
}
