import { ipcMain } from "electron"
import { DietaController } from "../controllers/DietaController"
import { CriarDietaDTO } from "../dtos/CriarDietaDTO"
import { AtualizarDietaDTO } from "../dtos/AtualizarDietaDTO"
import { ExcluirDietaDTO } from "../dtos/ExcluirDietaDTO"
import { BuscarDietaPacienteDTO } from "../dtos/BuscarDietaPacienteDTO"
import { ListarDietasDTO } from "../dtos/ListarDietasDTO"
import { ConsultarDietaDTO } from "../dtos/ConsultarDietaDTO"

export function dietaIPC(dietaController: DietaController) {
  ipcMain.handle("criar-dieta", async (event, data: CriarDietaDTO) => {
    return await dietaController.criarDieta(data)
  })

  ipcMain.handle("atualizar-dieta", async (event, data: AtualizarDietaDTO) => {
    return await dietaController.atualizarDieta(data)
  })

  ipcMain.handle("excluir-dieta", async (event, data: ExcluirDietaDTO) => {
    return await dietaController.excluirDieta(data.id)
  })

  ipcMain.handle("buscar-dieta-paciente", async (event, data: BuscarDietaPacienteDTO) => {
    return await dietaController.buscarDietaPaciente(data)
  })

  ipcMain.handle("listar-dietas", async (event, data: ListarDietasDTO) => {
    return await dietaController.listarDietas(data)
  })

  ipcMain.handle("consultar-dieta", async (event, data: ConsultarDietaDTO) => {
    return await dietaController.consultarDados(data)
  })
}
