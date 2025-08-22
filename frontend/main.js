const { app, BrowserWindow } = require("electron");
const { java, importClass } = require("java-bridge")

const UserService = importClass("Main");

async function getUser(){
  console.log("\n ------------------------------------------------------------ \n Aqui")
  const user = await UserService.getUserById("123");
  console.log("Resposta do Java:", user);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");

  getUser();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});