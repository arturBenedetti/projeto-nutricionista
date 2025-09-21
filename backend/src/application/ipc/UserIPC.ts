import { ipcMain } from "electron";
import { UserController } from "../controllers/UserController";
import { IUserRepository } from "../interfaces/IUserRepository";

export function registerUserIPC(userController: UserController) {
  ipcMain.handle(
    "user:create",
    async (_event, data: { name: string; email: string }) => {
      return await userController.create(data);
    }
  );

  ipcMain.handle("user:list", async () => {
    return await userController.list();
  });
}
