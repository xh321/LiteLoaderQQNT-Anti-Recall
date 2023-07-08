const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("anti_recall", {
    recallTip: (callback) => ipcRenderer.on(
        "LiteLoader.anti_recall.mainWindow.recallTip",
        callback
    ),
});