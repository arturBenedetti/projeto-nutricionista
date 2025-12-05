import { IAlimentoRepository } from "../../application/interfaces/IAlimentoRepository";
import { Alimento } from "../../domain/entities/Alimento";
import { Collection, Db } from "mongodb";

interface AlimentoDocument {
  _id: string;
  nome: string;
  categoriaId: string;
  energiaKcal: number;
  carboidratos: number;
  proteinas: number;
  gorduras: number;
  fibras: number;
}

export class AlimentoRepository implements IAlimentoRepository {
  private collection: Collection<AlimentoDocument>;

  constructor(db: Db) {
    this.collection = db.collection<AlimentoDocument>("alimentos");
  }

  async insertMany(alimentos: Alimento[]): Promise<void> {
    const documents = alimentos.map((alimento) => ({
      _id: alimento.id,
      nome: alimento.nome,
      categoriaId: alimento.categoriaId,
      energiaKcal: alimento.energiaKcal,
      carboidratos: alimento.carboidratos,
      proteinas: alimento.proteinas,
      gorduras: alimento.gorduras,
      fibras: alimento.fibras,
    }));
    await this.collection.insertMany(documents);
  }

  async findByCategoria(categoriaId: string): Promise<Alimento[]> {
    const documents = await this.collection.find({ categoriaId: categoriaId }).toArray();
    return documents.map(
      (doc) =>
        new Alimento(
          doc._id.toString(),
          doc.nome,
          doc.categoriaId,
          doc.energiaKcal,
          doc.carboidratos,
          doc.proteinas,
          doc.gorduras,
          doc.fibras
        )
    );
  }

  async searchByNome(termo: string): Promise<Alimento[]> {
    const regex = new RegExp(termo, "i");
    const documents = await this.collection.find({ nome: regex }).toArray();
    return documents.map(
      (doc) =>
        new Alimento(
          doc._id.toString(),
          doc.nome,
          doc.categoriaId,
          doc.energiaKcal,
          doc.carboidratos,
          doc.proteinas,
          doc.gorduras,
          doc.fibras
        )
    );
  }
}

