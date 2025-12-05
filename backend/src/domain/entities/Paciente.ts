import { EvolutionImagesModel } from "../models/EvolutionImagesModel";

export class Paciente {
  constructor(
    public readonly id: string,
    public readonly idUsuario: string,
    public idNutricionista: string,
    public nome: string,
    public sexo: string,
    public email: string,
    public dataNascimento: Date,
    public peso: number,
    public altura: number,
    public anamnese: string,
    public fotosEvolucao: EvolutionImagesModel[]
  ) {}
}
