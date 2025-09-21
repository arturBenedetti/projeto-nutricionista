import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  createUser: (data: { name: string; email: string }) =>
    ipcRenderer.invoke("user:create", data),
  listUsers: () => ipcRenderer.invoke("user:list"),
});
