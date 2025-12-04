import { IAlimentoRepository } from "../interfaces/IAlimentoRepository"

export class AlimentoController {
  constructor(private alimentoRepo: IAlimentoRepository) {}

  async buscarAlimentos(termo: string) {
    if (!termo || termo.trim().length === 0) {
      return { alimentos: [] }
    }
    const alimentos = await this.alimentoRepo.searchByNome(termo.trim())
    return {
      alimentos: alimentos.map((a) => ({
        id: a.id,
        nome: a.nome,
        energiaKcal: a.energiaKcal,
        carboidratos: a.carboidratos,
        proteinas: a.proteinas,
        gorduras: a.gorduras,
        fibras: a.fibras,
      })),
    }
  }
}


