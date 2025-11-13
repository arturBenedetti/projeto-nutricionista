import { ICategoriaAlimentoRepository } from "../../application/interfaces/ICategoriaAlimentoRepository";
import { CategoriaAlimento } from "../../domain/entities/CategoriaAlimento";
import { Collection, Db } from "mongodb";

interface CategoriaAlimentoDocument {
  _id: string;
  nome: string;
  ordem: number;
}

export class CategoriaAlimentoRepository implements ICategoriaAlimentoRepository {
  private collection: Collection<CategoriaAlimentoDocument>;

  constructor(db: Db) {
    this.collection = db.collection<CategoriaAlimentoDocument>("categorias_alimentos");
  }

  async insertMany(categorias: CategoriaAlimento[]): Promise<void> {
    const documents = categorias.map((categoria) => ({
      _id: categoria.id,
      nome: categoria.nome,
      ordem: categoria.ordem,
    }));
    await this.collection.insertMany(documents);
  }

  async findAll(): Promise<CategoriaAlimento[]> {
    const documents = await this.collection.find().sort({ ordem: 1 }).toArray();
    return documents.map(
      (doc) =>
        new CategoriaAlimento(
          doc._id.toString(),
          doc.nome,
          doc.ordem
        )
    );
  }

  async findByNome(nome: string): Promise<CategoriaAlimento | null> {
    const doc = await this.collection.findOne({ nome: nome });
    if (!doc) {
      return null;
    }
    return new CategoriaAlimento(
      doc._id.toString(),
      doc.nome,
      doc.ordem
    );
  }
}

