import { IUsuarioRepository } from "../../application/interfaces/IUsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";
import { Collection, Db } from "mongodb";

interface UsuarioDocument {
  _id: string;
  name: string;
  email: string;
  user: string;
  password: string;
  idNutricionista: string;
  isPaciente: boolean;
  isNutricionista: boolean;
}

export class UsuarioRepository implements IUsuarioRepository {
  private collection: Collection<UsuarioDocument>;

  constructor(db: Db) {
    this.collection = db.collection<UsuarioDocument>("users");
  }

  async save(user: Usuario): Promise<Usuario> {
    const userDoc = {
      _id: user.id,
      name: user.name,
      email: user.email,
      user: user.user,
      password: user.password,
      idNutricionista: user.idNutricionista,
      isPaciente: user.isPaciente,
      isNutricionista: user.isNutricionista,
    };
    await this.collection.insertOne(userDoc);
    return user;
  }

  async findAll(): Promise<Usuario[]> {
    const documents = await this.collection.find().toArray();
    return documents.map(
      (doc) =>
        new Usuario(
          doc._id.toString(),
          doc.name,
          doc.email,
          doc.user,
          doc.password || "",
          doc.idNutricionista,
          doc.isPaciente,
          doc.isNutricionista
        )
    );
  }
}
