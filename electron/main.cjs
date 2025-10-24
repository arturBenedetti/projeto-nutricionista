const { app, BrowserWindow, screen } = require("electron");
const fs = require("fs");
const path = require("path");

const stateFile = path.join(app.getPath("userData"), "window-state.json");
function readWindowState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch {
    // Primeira execução → sem arquivo salvo
    return null;
  }
}

function saveWindowState(win) {
  if (!win) return;

  const bounds = win.getBounds();
  const isMaximized = win.isMaximized();
  const isFullScreen = win.isFullScreen();

  const state = { bounds, isMaximized, isFullScreen };

  fs.writeFileSync(stateFile, JSON.stringify(state));
}

const { connectMongo } = require("../backend/dist/infrastructure/db/mongo");

const {
  UsuarioRepository,
} = require("../backend/dist/infrastructure/repositories/UsuarioRepository");
const {
  UsuarioService,
} = require("../backend/dist/infrastructure/services/UsuarioService");
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
  const savedState = readWindowState();
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    x: savedState?.bounds?.x ?? undefined,
    y: savedState?.bounds?.y ?? undefined,
    width: savedState?.bounds?.width ?? 1280,
    height: savedState?.bounds?.height ?? 720,
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
  const usuarioService = new UsuarioService(userRepo);
  const userController = new UsuarioController(userRepo);

  const loginRepo = new LoginRepository(db);
  const loginController = new LoginController(loginRepo);

  const pacienteRepo = new PacienteRepository(db);
  const pacienteController = new PacienteController(
    pacienteRepo,
    usuarioService
  );

  // Registra IPCs
  registerUserIPC(userController);
  loginIPC(loginController);
  pacienteIPC(pacienteController);

  mainWindow.loadURL("http://localhost:5173");

  if (!savedState) {
    mainWindow.maximize();
  } else if (savedState.isMaximized) {
    mainWindow.maximize();
  } else if (savedState.isFullScreen) {
    mainWindow.setFullScreen(true);
  }

  mainWindow.on("close", () => saveWindowState(mainWindow));

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
