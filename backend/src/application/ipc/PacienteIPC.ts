import { ipcMain } from "electron";
import { PacienteController } from "../controllers/PacienteController";

export function pacienteIPC(pacienteController: PacienteController) {
  ipcMain.handle("criarPaciente", async (_event, data) => {
    return await pacienteController.criarPaciente(data);
  });
  ipcMain.handle("editarPaciente", async (_event, data) => {
    return await pacienteController.editarPaciente(data);
  });
  ipcMain.handle("consultarDados", async (_event, data) => {
    const ret = await pacienteController.consultarDados(data);
    const foo = "bar";
    return ret;
  });
  ipcMain.handle("listarPacientes", async (_event, data) => {
    return await pacienteController.listarPacientes(data);
  });
  ipcMain.handle("excluirPaciente", async (_event, data) => {
    return await pacienteController.excluirPaciente(data);
  });
}
