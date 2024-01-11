const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", new (function () {
    
    this.isMaxamized = false
    this.minimizeWindow = () => {
        ipcRenderer.send("minimize-window");
    }

    this.maximizeWindow = () => {
        ipcRenderer.send("maximize-window");
        this.isMaxamized = true;
    }

    this.unmaximizeWindow = () => {
        ipcRenderer.send("unmaximize-window");
        this.isMaxamized = false;
    }

    this.closeWindow = () => {
        ipcRenderer.send("close-window");
    }

    this.updateAvailable = () => {
        ipcRenderer.send("update-available");
    }
    // ipcRenderer.on("maximized-window", (state) => {
    //     console.log('PRELAOD', state);
    //     this.isMaxamized = state;
    // })
}));