import { IPacienteRepository } from "../../application/interfaces/IPacienteRepository";
import { UploadImagemDTO } from "../../application/dtos/UploadImagemDTO";
import { EvolutionImagesModel } from "../models/EvolutionImagesModel";

export class AdicionarImagemEvolucaoUseCase {
  constructor(private pacienteRepo: IPacienteRepository) {}

  async adicionarImagem(dto: UploadImagemDTO): Promise<boolean> {
    try {
      const paciente = await this.pacienteRepo.findById(dto.idPaciente);
      if (!paciente) {
        throw new Error("Paciente não encontrado");
      }

      const dataAtual = new Date();
      const dataFormatada = dataAtual.toISOString().split("T")[0]; // YYYY-MM-DD

      // Verifica se já existe peso para o dia de hoje
      const fotosEvolucao = paciente.fotosEvolucao || [];
      const imagensDoDia = fotosEvolucao.filter((img) => {
        const dataImagem = new Date(img.date);
        const dataImgFormatada = dataImagem.toISOString().split("T")[0];
        return dataImgFormatada === dataFormatada;
      });

      // Se já existe peso para o dia, usa o mesmo peso. Caso contrário, usa o peso informado
      const pesoParaUsar =
        imagensDoDia.find((img) => img.peso)?.peso || dto.peso;

      // Constrói o objeto da imagem, incluindo peso apenas se estiver definido
      const novaImagem: EvolutionImagesModel = {
        date: dataAtual,
        mimeType: dto.mimeType,
        imageBase64: dto.imageBase64,
        ...(pesoParaUsar !== undefined && { peso: pesoParaUsar }),
      };

      // Adiciona a nova imagem ao array de fotos de evolução
      fotosEvolucao.push(novaImagem);

      // Atualiza o paciente com a nova imagem
      paciente.fotosEvolucao = fotosEvolucao;
      await this.pacienteRepo.update(paciente);

      return true;
    } catch (error) {
      console.error("Erro ao adicionar imagem de evolução:", error);
      return false;
    }
  }
}

