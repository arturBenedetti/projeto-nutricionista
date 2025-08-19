const { app, BrowserWindow } = require('electron');

// Ao salvar, atualiza a página sem precisar rodar o código de inicialização novamente
require('electron-reload')(__dirname, { electron: require(`${__dirname}/node_modules/electron`) });

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 800, // Define largura da janela
        height: 800, // Define altura da janela
        resizable: false // Habilita ou desabilita o ajuste de tamanho da janela
    }); 

    mainWindow.loadURL(`file://${__dirname}/index.html`);

});