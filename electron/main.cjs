const { app, BrowserWindow } = require("electron");
const path = require("path");

const { connectMongo } = require("../backend/dist/infrastructure/db/mongo");

const {
  UsuarioRepository,
} = require("../backend/dist/infrastructure/repositories/UsuarioRepository");
const {
  UsuarioController,
} = require("../backend/dist/application/controllers/UsuarioController");
const { registerUserIPC } = require("../backend/dist/application/ipc/UserIPC");

const {
  LoginRepository,
} = require("../backend/dist/infrastructure/repositories/LoginRepository");
const {
  LoginController,
} = require("../backend/dist/application/controllers/LoginController");
const { loginIPC } = require("../backend/dist/application/ipc/LoginIPC");

const {
  PacienteRepository,
} = require("../backend/dist/infrastructure/repositories/PacienteRepository");
const {
  PacienteController,
} = require("../backend/dist/application/controllers/PacienteController");
const { pacienteIPC } = require("../backend/dist/application/ipc/PacienteIPC");

require("electron-reload")(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`),
});

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Configura backend
  const db = await connectMongo();

  const userRepo = new UsuarioRepository(db);
  const userController = new UsuarioController(userRepo);

  const loginRepo = new LoginRepository(db);
  const loginController = new LoginController(loginRepo);

  const pacienteRepo = new PacienteRepository(db);
  const pacienteController = new PacienteController(pacienteRepo);

  // Registra IPCs
  registerUserIPC(userController);
  loginIPC(loginController);
  pacienteIPC(pacienteController);

  mainWindow.loadURL("http://localhost:5173");
  return mainWindow;
}

app.on("ready", () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
