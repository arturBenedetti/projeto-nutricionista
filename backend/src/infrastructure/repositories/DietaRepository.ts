import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { Dieta } from "../../domain/entities/Dieta"
import { Collection, Db } from "mongodb"

interface DietaDocument {
  _id: string
  idNutricionista: string
  idPaciente: string
  dataInicio: Date
  dataFim: Date
  descricao: string
  observacoes?: string
}

export class DietaRepository implements IDietaRepository {
  private collection: Collection<DietaDocument>

  constructor(db: Db) {
    this.collection = db.collection<DietaDocument>("dietas")
  }

  async save(dieta: Dieta): Promise<Dieta> {
    const dietaDoc: DietaDocument = {
      _id: dieta.id,
      idNutricionista: dieta.idNutricionista,
      idPaciente: dieta.idPaciente,
      dataInicio: dieta.dataInicio,
      dataFim: dieta.dataFim,
      descricao: dieta.descricao,
      ...(dieta.observacoes && { observacoes: dieta.observacoes }),
    }

    await this.collection.insertOne(dietaDoc)
    return dieta
  }

  async findAllByNutricionistaId(idNutricionista: string): Promise<Dieta[]> {
    const dietasDoc = await this.collection.find({ idNutricionista }).toArray()
    return dietasDoc.map((doc) => this.documentToEntity(doc))
  }

  async findAllByPacienteId(idPaciente: string): Promise<Dieta[]> {
    const dietasDoc = await this.collection.find({ idPaciente }).toArray()
    return dietasDoc.map((doc) => this.documentToEntity(doc))
  }

  async findAll(): Promise<Dieta[]> {
    const dietasDoc = await this.collection.find({}).toArray()
    return dietasDoc.map((doc) => this.documentToEntity(doc))
  }

  async findById(id: string): Promise<Dieta | null> {
    const dietaDoc = await this.collection.findOne({ _id: id })
    return dietaDoc ? this.documentToEntity(dietaDoc) : null
  }

  async update(id: string, dieta: Partial<Dieta>): Promise<Dieta | null> {
    const updateData: Partial<DietaDocument> = {}

    if (dieta.idNutricionista)
      updateData.idNutricionista = dieta.idNutricionista
    if (dieta.idPaciente) updateData.idPaciente = dieta.idPaciente
    if (dieta.dataInicio) updateData.dataInicio = dieta.dataInicio
    if (dieta.dataFim) updateData.dataFim = dieta.dataFim
    if (dieta.descricao) updateData.descricao = dieta.descricao
    if (dieta.observacoes !== undefined)
      updateData.observacoes = dieta.observacoes

    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: "after" }
    )

    return result ? this.documentToEntity(result) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  private documentToEntity(doc: DietaDocument): Dieta {
    return new Dieta(
      doc._id,
      doc.idNutricionista,
      doc.idPaciente,
      doc.dataInicio,
      doc.dataFim,
      doc.descricao,
      doc.observacoes
    )
  }
}
