import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { ExcluirImagemDTO } from "../../application/dtos/ExcluirImagemDTO";

export class ExcluirImagemEvolucaoUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async excluirImagem(dto: ExcluirImagemDTO): Promise<boolean> {
    try {
      const paciente = await this.pacienteRepo.findById(dto.idPaciente);
      if (!paciente) {
        throw new Error("Paciente não encontrado");
      }

      const fotosEvolucao = paciente.fotosEvolucao || [];
      
      // Filtra as imagens do dia especificado e ordena por data (mais recente primeiro)
      const imagensDoDia = fotosEvolucao
        .map((img, idx) => ({ img, idx }))
        .filter(({ img }) => {
          const dataImagem = new Date(img.date);
          const dataImgFormatada = dataImagem.toISOString().split("T")[0];
          return dataImgFormatada === dto.dataImagem;
        })
        .sort(
          (a, b) =>
            new Date(b.img.date).getTime() - new Date(a.img.date).getTime()
        );

      // Verifica se o índice é válido
      if (dto.indexImagem < 0 || dto.indexImagem >= imagensDoDia.length) {
        throw new Error("Índice de imagem inválido");
      }

      // Remove a imagem específica do array usando o índice original
      const imagemParaRemover = imagensDoDia[dto.indexImagem];
      if (!imagemParaRemover) {
        throw new Error("Imagem não encontrada");
      }
      
      const indiceGlobal = imagemParaRemover.idx;
      fotosEvolucao.splice(indiceGlobal, 1);
      paciente.fotosEvolucao = fotosEvolucao;
      await this.pacienteRepo.update(paciente);

      return true;
    } catch (error) {
      console.error("Erro ao excluir imagem de evolução:", error);
      return false;
    }
  }
}

