const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
  // User
  createUser: (data) => ipcRenderer.invoke("user:create", data),
  listUsers: () => ipcRenderer.invoke("user:list"),
  // Login
  login: (data) => ipcRenderer.invoke("login", data),
  changePassword: (data) => ipcRenderer.invoke("changePassword", data),
  // Paciente
  criarPaciente: (data) => ipcRenderer.invoke("criarPaciente", data),
  editarPaciente: (data) => ipcRenderer.invoke("editarPaciente", data),
  consultarDados: (data) => ipcRenderer.invoke("consultarDados", data),
  listarPacientes: (data) => ipcRenderer.invoke("listarPacientes", data),
  excluirPaciente: (data) => ipcRenderer.invoke("excluirPaciente", data),
  uploadImagemEvolucao: (data) => ipcRenderer.invoke("uploadImagemEvolucao", data),
  listarImagensEvolucao: (data) => ipcRenderer.invoke("listarImagensEvolucao", data),
  // Dieta
  criarDieta: (data) => ipcRenderer.invoke("criar-dieta", data),
  atualizarDieta: (data) => ipcRenderer.invoke("atualizar-dieta", data),
  excluirDieta: (data) => ipcRenderer.invoke("excluir-dieta", data),
  buscarDietaPaciente: (data) => ipcRenderer.invoke("buscar-dieta-paciente", data),
  listarDietas: (data) => ipcRenderer.invoke("listar-dietas", data),
  consultarDieta: (data) => ipcRenderer.invoke("consultar-dieta", data),
  // Alimento
  buscarAlimentos: (termo) => ipcRenderer.invoke("buscar-alimentos", termo),
})
