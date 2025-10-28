export interface CriarDietaDTO {
  idNutricionista: string
  idPaciente: string
  dataInicio: string
  dataFim: string
  descricao: string
  observacoes?: string
}
