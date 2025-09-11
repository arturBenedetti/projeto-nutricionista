const { app, BrowserWindow } = require('electron');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    resizable: true
  });

  mainWindow.loadURL('http://localhost:5173');
});
