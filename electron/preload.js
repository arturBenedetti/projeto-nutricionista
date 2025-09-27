const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // User
  createUser: (data) => ipcRenderer.invoke("user:create", data),
  listUsers: () => ipcRenderer.invoke("user:list"),
  // Login
  login: (data) => ipcRenderer.invoke("login", data),
});
