import { ipcMain } from "electron";
import { PacienteController } from "../controllers/PacienteController";
import { IPacienteRepository } from "../interfaces/IPacienteRepository";

export function pacienteIPC(pacienteController: PacienteController) {
  ipcMain.handle("criarPaciente", async (_event, data) => {
    return await pacienteController.criarPaciente(data);
  });
}
