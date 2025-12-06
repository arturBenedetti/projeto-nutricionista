import { Dieta } from "../entities/Dieta"
import { PlanoRefeicao } from "../entities/PlanoRefeicao"
import { Refeicao } from "../entities/Refeicao"
import { AlimentoRefeicao } from "../entities/AlimentoRefeicao"
import { IDietaRepository } from "../../application/interfaces/IDietaRepository"
import { CriarDietaDTO } from "../../application/dtos/CriarDietaDTO"
import { v4 as uuidv4 } from "uuid"
import { CriarDietaResponseDTO } from "../../application/dtos/ConsultarDietaResponseDTO"

export class CreateDietaUseCase {
  constructor(private dietaRepo: IDietaRepository) {}

  async criarDieta(
    dietaDTO: CriarDietaDTO
  ): Promise<CriarDietaResponseDTO | null> {
    try {
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

      const dieta = new Dieta(
        uuidv4(),
        dietaDTO.idNutricionista,
        dietaDTO.idPaciente,
        new Date(dietaDTO.dataInicio),
        new Date(dietaDTO.dataFim),
        dietaDTO.descricao,
        dietaDTO.observacoes,
        planosRefeicao
      )

      const novaDieta = await this.dietaRepo.save(dieta)
      return CriarDietaResponseDTO.fromDieta(novaDieta)
    } catch (error) {
      console.error("Erro durante a criação de dieta:", error)
      return null
    }
  }
}
