import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { Dieta } from "../../domain/entities/Dieta"
import { PlanoRefeicao } from "../../domain/entities/PlanoRefeicao"
import { Refeicao } from "../../domain/entities/Refeicao"
import { AlimentoRefeicao } from "../../domain/entities/AlimentoRefeicao"
import { Collection, Db } from "mongodb"

interface AlimentoRefeicaoDocument {
  idAlimento: string
  quantidade: number
  nomeAlimento?: string
}

interface RefeicaoDocument {
  id: string
  nome: string
  alimentos: AlimentoRefeicaoDocument[]
  observacao?: string
}

interface PlanoRefeicaoDocument {
  id: string
  diaSemana: number
  refeicoes: RefeicaoDocument[]
}

interface DietaDocument {
  _id: string
  idNutricionista: string
  idPaciente: string
  dataInicio: Date
  dataFim: Date
  descricao: string
  observacoes?: string
  planosRefeicao?: PlanoRefeicaoDocument[]
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
      ...(dieta.planosRefeicao && {
        planosRefeicao: dieta.planosRefeicao.map((plano) => ({
          id: plano.id,
          diaSemana: plano.diaSemana,
          refeicoes: plano.refeicoes.map((refeicao) => ({
            id: refeicao.id,
            nome: refeicao.nome,
            alimentos: refeicao.alimentos.map((alimento) => ({
              idAlimento: alimento.idAlimento,
              quantidade: alimento.quantidade,
              ...(alimento.nomeAlimento && { nomeAlimento: alimento.nomeAlimento }),
            })),
            ...(refeicao.observacao && { observacao: refeicao.observacao }),
          })),
        })),
      }),
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
    if (dieta.planosRefeicao !== undefined) {
      updateData.planosRefeicao = dieta.planosRefeicao.map((plano) => ({
        id: plano.id,
        diaSemana: plano.diaSemana,
        refeicoes: plano.refeicoes.map((refeicao) => ({
          id: refeicao.id,
          nome: refeicao.nome,
          alimentos: refeicao.alimentos.map((alimento) => ({
            idAlimento: alimento.idAlimento,
            quantidade: alimento.quantidade,
            ...(alimento.nomeAlimento && { nomeAlimento: alimento.nomeAlimento }),
          })),
          ...(refeicao.observacao && { observacao: refeicao.observacao }),
        })),
      }))
    }

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
    // Converte planos de refeições do documento para entidades
    const planosRefeicao: PlanoRefeicao[] | undefined = doc.planosRefeicao?.map(
      (planoDoc) => {
        const refeicoes: Refeicao[] = planoDoc.refeicoes.map((refeicaoDoc) => {
          const alimentos: AlimentoRefeicao[] = refeicaoDoc.alimentos.map(
            (alimentoDoc) =>
              new AlimentoRefeicao(
                alimentoDoc.idAlimento,
                alimentoDoc.quantidade,
                alimentoDoc.nomeAlimento
              )
          )
          return new Refeicao(
            refeicaoDoc.id,
            refeicaoDoc.nome,
            alimentos,
            refeicaoDoc.observacao
          )
        })
        return new PlanoRefeicao(planoDoc.id, planoDoc.diaSemana, refeicoes)
      }
    )

    return new Dieta(
      doc._id,
      doc.idNutricionista,
      doc.idPaciente,
      doc.dataInicio,
      doc.dataFim,
      doc.descricao,
      doc.observacoes,
      planosRefeicao
    )
  }
}
