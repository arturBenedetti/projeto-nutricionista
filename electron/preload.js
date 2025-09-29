const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  createUser: (data) => ipcRenderer.invoke("user:create", data),
  listUsers: () => ipcRenderer.invoke("user:list"),
});
