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

      const novaImagem: EvolutionImagesModel = {
        date: new Date(),
        mimeType: dto.mimeType,
        imageBase64: dto.imageBase64,
      };

      // Adiciona a nova imagem ao array de fotos de evolução
      const fotosEvolucao = paciente.fotosEvolucao || [];
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

