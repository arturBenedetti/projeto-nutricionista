const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
  // User
  createUser: (data) => ipcRenderer.invoke("user:create", data),
  listUsers: () => ipcRenderer.invoke("user:list"),
  // Login
  login: (data) => ipcRenderer.invoke("login", data),
  // Paciente
  criarPaciente: (data) => ipcRenderer.invoke("criarPaciente", data),
  editarPaciente: (data) => ipcRenderer.invoke("editarPaciente", data),
  consultarDados: (data) => ipcRenderer.invoke("consultarDados", data),
  listarPacientes: (data) => ipcRenderer.invoke("listarPacientes", data),
  excluirPaciente: (data) => ipcRenderer.invoke("excluirPaciente", data),
  // Dieta
  criarDieta: (data) => ipcRenderer.invoke("criar-dieta", data),
  listarDietas: (data) => ipcRenderer.invoke("listar-dietas", data),
  consultarDieta: (data) => ipcRenderer.invoke("consultar-dieta", data),
})
