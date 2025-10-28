import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { Paciente } from "../../domain/entities/Paciente";
import { Collection, Db } from "mongodb";

interface PacienteDocument {
  _id: string;
  idUsuario: string;
  idNutricionista: string;
  nome: string;
  sexo: string;
  email: string;
  dataNascimento: Date;
  peso: number;
  altura: number;
  anamnese: string;
}

export class PacienteRepository implements IPacienteRepository {
  private collection: Collection<PacienteDocument>;

  constructor(db: Db) {
    this.collection = db.collection<PacienteDocument>("pacientes");
  }

  async save(paciente: Paciente): Promise<Paciente> {
    const pacienteDoc = {
      _id: paciente.id,
      idUsuario: paciente.idUsuario,
      idNutricionista: paciente.idNutricionista,
      nome: paciente.nome,
      sexo: paciente.sexo,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      peso: paciente.peso,
      altura: paciente.altura,
      anamnese: paciente.anamnese,
    };
    await this.collection.insertOne(pacienteDoc);
    return paciente;
  }

  async update(paciente: Paciente): Promise<Paciente> {
    const document = this.collection.updateOne(
      { _id: paciente.id },
      {
        $set: {
          nome: paciente.nome,
          sexo: paciente.sexo,
          email: paciente.email,
          dataNascimento: paciente.dataNascimento,
          peso: paciente.peso,
          altura: paciente.altura,
          anamnese: paciente.anamnese,
        },
      }
    );

    const pacienteAtualizado = await this.findById(paciente.id);
    if (!pacienteAtualizado) throw new Error("Erro ao atualizar paciente");
    
    return pacienteAtualizado;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      return false;
    }
  }

  async findAll(): Promise<Paciente[]> {
    const documents = await this.collection.find().toArray();
    return documents.map(
      (doc) =>
        new Paciente(
          doc._id,
          doc.idUsuario,
          doc.idNutricionista,
          doc.nome,
          doc.sexo,
          doc.email,
          doc.dataNascimento,
          doc.peso,
          doc.altura,
          doc.anamnese
        )
    );
  }

  async findById(id: string): Promise<Paciente | null> {
    const document = await this.collection.findOne({ _id: id });
    if (!document) return null;

    return new Paciente(
      document._id,
      document.idUsuario,
      document.idNutricionista,
      document.nome,
      document.sexo,
      document.email,
      document.dataNascimento,
      document.peso,
      document.altura,
      document.anamnese
    );
  }

  async findAllByNutricionistaId(id: string): Promise<Paciente[]> {
    const documents = await this.collection
      .find({ idNutricionista: id })
      .toArray();

    return documents.map(
      (doc) =>
        new Paciente(
          doc._id,
          doc.idUsuario,
          doc.idNutricionista,
          doc.nome,
          doc.sexo,
          doc.email,
          doc.dataNascimento,
          doc.peso,
          doc.altura,
          doc.anamnese
        )
    );
  }

  async findByUsuarioId(id: string): Promise<Paciente | null> {
    const pacienteDoc = await this.collection.findOne({ idUsuario: id });

    if (!pacienteDoc) {
      return null;
    }

    return new Paciente(
      pacienteDoc._id,
      pacienteDoc.idUsuario,
      pacienteDoc.idNutricionista,
      pacienteDoc.nome,
      pacienteDoc.sexo,
      pacienteDoc.email,
      pacienteDoc.dataNascimento,
      pacienteDoc.peso,
      pacienteDoc.altura,
      pacienteDoc.anamnese
    );
  }
}
