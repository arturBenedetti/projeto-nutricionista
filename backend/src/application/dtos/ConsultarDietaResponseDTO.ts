import { Dieta } from "../../domain/entities/Dieta"
import { PlanoRefeicaoDTO } from "./PlanoRefeicaoDTO"
import { RefeicaoDTO } from "./RefeicaoDTO"
import { AlimentoRefeicaoDTO } from "./AlimentoRefeicaoDTO"

export class CriarDietaResponseDTO {
  constructor(
    public readonly id: string,
    public readonly idNutricionista: string,
    public readonly idPaciente: string,
    public readonly dataInicio: string,
    public readonly dataFim: string,
    public readonly descricao: string,
    public readonly observacoes?: string,
    public readonly planosRefeicao?: PlanoRefeicaoDTO[]
  ) {}

  static fromDieta(dieta: Dieta | null): CriarDietaResponseDTO {
    if (!dieta) {
      throw new Error("Dieta não encontrada")
    }

    // Converte planos de refeições para DTOs
    const planosRefeicaoDTO: PlanoRefeicaoDTO[] | undefined = dieta.planosRefeicao?.map(
      (plano) => ({
        id: plano.id,
        diaSemana: plano.diaSemana,
        refeicoes: plano.refeicoes.map(
          (refeicao): RefeicaoDTO => ({
            id: refeicao.id,
            nome: refeicao.nome,
            alimentos: refeicao.alimentos.map(
              (alimento): AlimentoRefeicaoDTO => ({
                idAlimento: alimento.idAlimento,
                quantidade: alimento.quantidade,
                ...(alimento.nomeAlimento && { nomeAlimento: alimento.nomeAlimento }),
              })
            ),
            ...(refeicao.observacao && { observacao: refeicao.observacao }),
          })
        ),
      })
    )

    return new CriarDietaResponseDTO(
      dieta.id,
      dieta.idNutricionista,
      dieta.idPaciente,
      dieta.dataInicio.toISOString(),
      dieta.dataFim.toISOString(),
      dieta.descricao,
      dieta.observacoes,
      planosRefeicaoDTO
    )
  }
}
