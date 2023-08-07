const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("anti_recall", {
    clearDb: () => ipcRenderer.invoke("LiteLoader.anti_recall.clearDb"),
    getNowConfig: () =>
        ipcRenderer.invoke("LiteLoader.anti_recall.getNowConfig"),
    saveConfig: (config) =>
        ipcRenderer.invoke("LiteLoader.anti_recall.saveConfig", config),
    repatchCss: (callback) =>
        ipcRenderer.on(
            "LiteLoader.anti_recall.mainWindow.repatchCss",
            callback
        ),
    recallTip: (callback) =>
        ipcRenderer.on("LiteLoader.anti_recall.mainWindow.recallTip", callback),
    recallTipList: (callback) =>
        ipcRenderer.on(
            "LiteLoader.anti_recall.mainWindow.recallTipList",
            callback
        )
});
