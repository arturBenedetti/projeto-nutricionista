import { ipcMain } from "electron"
import { AlimentoController } from "../controllers/AlimentoController"

export function alimentoIPC(alimentoController: AlimentoController) {
  ipcMain.handle("buscar-alimentos", async (event, termo: string) => {
    return await alimentoController.buscarAlimentos(termo)
  })
}


