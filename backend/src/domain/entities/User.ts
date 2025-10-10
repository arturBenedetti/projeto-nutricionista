export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public user: string,
    private _password: string // Senha agora é privada
  ) {}

  // Getter para a senha (apenas para uso interno)
  get password(): string {
    return this._password;
  }

  // Método para obter dados públicos do usuário (sem senha)
  getPublicData() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      user: this.user
    };
  }

  // Método para atualizar senha (com hash)
  async updatePassword(newPassword: string, bcrypt: any): Promise<void> {
    this._password = await bcrypt.hash(newPassword, 12);
  }
}
