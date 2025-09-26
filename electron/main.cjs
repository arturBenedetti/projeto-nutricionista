const { app, BrowserWindow } = require("electron");
const path = require("path");

const { connectMongo } = require("../backend/dist/infrastructure/db/mongo");
const {
  UserRepository,
} = require("../backend/dist/infrastructure/repositories/UserRepository");
const {
  UserController,
} = require("../backend/dist/application/controllers/UserController");
const { registerUserIPC } = require("../backend/dist/application/ipc/UserIPC");

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
  const userRepo = new UserRepository(db);
  const userController = new UserController(userRepo);

  // Registra IPCs
  registerUserIPC(userController);
  mainWindow.loadURL("http://localhost:5173");
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
