import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { Paciente } from "../../domain/entities/Paciente";
import { Collection, Db } from "mongodb";

interface PacienteDocument {
  _id: string;
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
  async findAllByNutricionistaId(id: string): Promise<Paciente[]> {
    const allDocs = await this.collection.find().toArray();
    const documents = await this.collection
      .find({ idNutricionista: id })
      .toArray();

    return documents.map(
      (doc) =>
        new Paciente(
          doc._id,
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
  async findAll(): Promise<Paciente[]> {
    const documents = await this.collection.find().toArray();
    return documents.map(
      (doc) =>
        new Paciente(
          doc._id,
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
}
