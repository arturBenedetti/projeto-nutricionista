export class UsuarioResponseDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly user: string;
  public readonly idNutricionista: string;

  constructor(
    id: string,
    name: string,
    email: string,
    user: string,
    idNutricionista: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.user = user;
    this.idNutricionista = idNutricionista;
  }
}
