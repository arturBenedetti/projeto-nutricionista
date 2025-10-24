import { ipcMain } from "electron"
import { DietaController } from "../controllers/DietaController"
import { CriarDietaDTO } from "../dtos/CriarDietaDTO"
import { ListarDietasDTO } from "../dtos/ListarDietasDTO"
import { ConsultarDietaDTO } from "../dtos/ConsultarDietaDTO"

export function dietaIPC(dietaController: DietaController) {
  ipcMain.handle("criar-dieta", async (event, data: CriarDietaDTO) => {
    return await dietaController.criarDieta(data)
  })

  ipcMain.handle("listar-dietas", async (event, data: ListarDietasDTO) => {
    return await dietaController.listarDietas(data)
  })

  ipcMain.handle("consultar-dieta", async (event, data: ConsultarDietaDTO) => {
    return await dietaController.consultarDados(data)
  })
}
