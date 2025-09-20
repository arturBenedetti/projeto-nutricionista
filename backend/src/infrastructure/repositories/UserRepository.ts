import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Collection, Db } from "mongodb";

export class UserRepository implements IUserRepository {
  private collection: Collection<User>;

  constructor(db: Db) {
    this.collection = db.collection<User>("users");
  }

  async save(user: User): Promise<User> {
    await this.collection.insertOne(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.collection.find().toArray();
  }
}
