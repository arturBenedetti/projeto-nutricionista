import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { AtualizarDietaDTO } from "../../application/dtos/AtualizarDietaDTO"
import { CriarDietaResponseDTO } from "../../application/dtos/ConsultarDietaResponseDTO"
import { Dieta } from "../entities/Dieta"
import { PlanoRefeicao } from "../entities/PlanoRefeicao"
import { Refeicao } from "../entities/Refeicao"
import { AlimentoRefeicao } from "../entities/AlimentoRefeicao"
import { v4 as uuidv4 } from "uuid"

export class UpdateDietaUseCase {
  constructor(private dietaRepo: IDietaRepository) {}

  async atualizarDieta(
    dietaDTO: AtualizarDietaDTO
  ): Promise<CriarDietaResponseDTO | null> {
    try {
      // Verifica se a dieta existe
      const dietaExistente = await this.dietaRepo.findById(dietaDTO.id)
      if (!dietaExistente) {
        throw new Error("Dieta não encontrada")
      }

      // Converte planos de refeições do DTO para entidades
      const planosRefeicao: PlanoRefeicao[] | undefined =
        dietaDTO.planosRefeicao?.map((planoDTO) => {
          const refeicoes: Refeicao[] = planoDTO.refeicoes.map((refeicaoDTO) => {
            const alimentos: AlimentoRefeicao[] = refeicaoDTO.alimentos.map(
              (alimentoDTO) =>
                new AlimentoRefeicao(
                  alimentoDTO.idAlimento,
                  alimentoDTO.quantidade,
                  alimentoDTO.nomeAlimento
                )
            )
            return new Refeicao(
              refeicaoDTO.id || uuidv4(),
              refeicaoDTO.nome,
              alimentos,
              refeicaoDTO.observacao
            )
          })
          return new PlanoRefeicao(
            planoDTO.id || uuidv4(),
            planoDTO.diaSemana,
            refeicoes
          )
        })

      // Cria objeto Dieta com os dados atualizados
      const dietaAtualizada = new Dieta(
        dietaDTO.id,
        dietaDTO.idNutricionista,
        dietaDTO.idPaciente,
        new Date(dietaDTO.dataInicio),
        new Date(dietaDTO.dataFim),
        dietaDTO.descricao,
        dietaDTO.observacoes,
        planosRefeicao
      )

      // Atualiza a dieta no repositório
      const dieta = await this.dietaRepo.update(dietaDTO.id, dietaAtualizada)
      if (!dieta) {
        throw new Error("Erro ao atualizar dieta")
      }

      return CriarDietaResponseDTO.fromDieta(dieta)
    } catch (error) {
      console.error("Erro durante a atualização de dieta:", error)
      return null
    }
  }
}

