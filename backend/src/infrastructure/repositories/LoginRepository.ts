import { ILoginRepository } from "../../application/interfaces/ILoginRepository";
import { User } from "../../domain/entities/User";
import { LoginDTO } from "../../application/dtos/LoginDTO";
import { Collection, Db } from "mongodb";

export class LoginRepository implements ILoginRepository {
  private collection: Collection<User>;

  constructor(db: Db) {
    this.collection = db.collection<User>("users");
  }

  async findUserByCredentials(data: LoginDTO): Promise<User | null> {
    const user = await this.collection.findOne({
      user: data.user,
      password: data.password, // Em produção, use hash!
    });
    return user
      ? new User(
          user._id.toString(),
          user.name,
          user.email,
          user.user,
          user.password
        )
      : null;
  }
}
