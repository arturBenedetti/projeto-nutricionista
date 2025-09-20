"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserIPC = registerUserIPC;
const electron_1 = require("electron");
function registerUserIPC(userController) {
    electron_1.ipcMain.handle("user:create", async (_event, data) => {
        return await userController.create(data);
    });
    electron_1.ipcMain.handle("user:list", async () => {
        return await userController.list();
    });
}
//# sourceMappingURL=UserIPC.js.map