import { ipcMain } from "electron";
import { PacienteController } from "../controllers/PacienteController";

export function pacienteIPC(pacienteController: PacienteController) {
  ipcMain.handle("criarPaciente", async (_event, data) => {
    return await pacienteController.criarPaciente(data);
  });
  ipcMain.handle("consultarDados", async (_event, data) => {
    return await pacienteController.consultarDados(data);
  ipcMain.handle("listarPacientes", async (_event, data) => {
    return await pacienteController.listarPacientes(data);
  });
}
