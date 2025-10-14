import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Collection, Db } from "mongodb";

interface UserDocument {
  _id: string;
  name: string;
  email: string;
  user: string;
  password: string;
}

export class UserRepository implements IUserRepository {
  private collection: Collection<UserDocument>;

  constructor(db: Db) {
    this.collection = db.collection<UserDocument>("users");
  }

  async save(user: User): Promise<User> {
    const userDoc = {
      _id: user.id,
      name: user.name,
      email: user.email,
      user: user.user,
      password: user.password,
    };
    await this.collection.insertOne(userDoc);
    return user;
  }

  async findAll(): Promise<User[]> {
    const documents = await this.collection.find().toArray();
    return documents.map(
      (doc) =>
        new User(
          doc._id.toString(),
          doc.name,
          doc.email,
          doc.user,
          doc.password || ""
        )
    );
  }
}
