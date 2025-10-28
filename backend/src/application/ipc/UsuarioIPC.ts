import { ipcMain } from "electron";
import { UsuarioController } from "../controllers/UsuarioController";

export function registerUserIPC(userController: UsuarioController) {
  ipcMain.handle("user:create", async (_event, data) => {
    return await userController.create(data);
  });

  ipcMain.handle("user:list", async () => {
    return await userController.list();
  });
}
