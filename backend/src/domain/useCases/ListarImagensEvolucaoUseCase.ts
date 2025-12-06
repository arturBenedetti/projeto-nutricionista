import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { ListarImagensDTO } from "../../application/dtos/ListarImagensDTO";
import { EvolutionImagesModel } from "../models/EvolutionImagesModel";

export interface ImagensAgrupadasPorData {
  data: string; // Data formatada (YYYY-MM-DD)
  dataCompleta: Date;
  imagens: EvolutionImagesModel[];
  peso?: number; // Peso do dia (da primeira imagem que tiver peso)
}

export class ListarImagensEvolucaoUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async listarImagens(dto: ListarImagensDTO): Promise<ImagensAgrupadasPorData[]> {
    try {
      const paciente = await this.pacienteRepo.findById(dto.idPaciente);
      if (!paciente || !paciente.fotosEvolucao) {
        return [];
      }

      // Agrupa imagens por data
      const imagensPorData = new Map<string, EvolutionImagesModel[]>();

      paciente.fotosEvolucao.forEach((imagem) => {
        const dataImagem = new Date(imagem.date);
        const dataFormatada = dataImagem.toISOString().split("T")[0]; // YYYY-MM-DD

        if (!imagensPorData.has(dataFormatada || "")) {
          imagensPorData.set(dataFormatada || "", []);
        }
        imagensPorData.get(dataFormatada || "")!.push(imagem);
      });

      // Converte para array e ordena por data (mais recente primeiro)
      const resultado: ImagensAgrupadasPorData[] = Array.from(
        imagensPorData.entries()
      ).map(([dataFormatada, imagens]) => {
        // Ordena imagens por data
        const imagensOrdenadas = imagens.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Pega o peso da primeira imagem que tiver peso (ou undefined)
        const pesoDoDia = imagensOrdenadas.find((img) => img.peso)?.peso;
        
        return {
          data: dataFormatada,
          dataCompleta: new Date(dataFormatada),
          imagens: imagensOrdenadas,
          ...(pesoDoDia !== undefined && { peso: pesoDoDia }),
        };
      });

      // Ordena por data (mais recente primeiro)
      resultado.sort(
        (a, b) => b.dataCompleta.getTime() - a.dataCompleta.getTime()
      );

      return resultado;
    } catch (error) {
      console.error("Erro ao listar imagens de evolução:", error);
      return [];
    }
  }
}

