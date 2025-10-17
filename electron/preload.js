const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // User
  createUser: (data) => ipcRenderer.invoke("user:create", data),
  listUsers: () => ipcRenderer.invoke("user:list"),
  // Login
  login: (data) => ipcRenderer.invoke("login", data),
  // Paciente
  criarPaciente: (data) => ipcRenderer.invoke("criarPaciente", data),
  consultarDados: (data) => ipcRenderer.invoke("consultarDados", data),
  listarPacientes: (data) => ipcRenderer.invoke("listarPacientes", data),
});
