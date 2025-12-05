import { IDietaRepository } from "../../application/interfaces/IDietaRepository"

export class DeleteDietaUseCase {
  constructor(private dietaRepo: IDietaRepository) {}

  async excluirDieta(id: string): Promise<boolean> {
    try {
      // Verifica se a dieta existe
      const dietaExistente = await this.dietaRepo.findById(id)
      if (!dietaExistente) {
        throw new Error("Dieta não encontrada")
      }

      // Exclui a dieta
      const sucesso = await this.dietaRepo.delete(id)
      return sucesso
    } catch (error) {
      console.error("Erro durante a exclusão de dieta:", error)
      return false
    }
  }
}

