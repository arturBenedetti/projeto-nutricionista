const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", {
  somar: (a, b) => {
    ipcRenderer.send("backend-request", { action: "somar", a, b });
  },
  onResponse: (callback) => {
    ipcRenderer.on("backend-response", (_, data) => callback(data));
  }
});
