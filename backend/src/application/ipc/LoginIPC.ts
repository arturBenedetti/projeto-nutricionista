import { ipcMain } from "electron";
import { LoginController } from "../controllers/LoginController";

export function loginIPC(loginController: LoginController) {
  ipcMain.handle("login", async (_event, data) => {
    return await loginController.login(data);
  });
  ipcMain.handle("changePassword", async (_event, data) => {
    return await loginController.changePassword(data);
  });
}
