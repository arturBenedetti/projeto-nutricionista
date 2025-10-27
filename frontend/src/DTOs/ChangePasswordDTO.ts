export class ChangePasswordDTO {
  public readonly id: string;
  public readonly oldPassword: string;
  public readonly newPassword: string;
  constructor(id: string, oldPassword: string, newPassword: string) {
    this.id = id;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}

