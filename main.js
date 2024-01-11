const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const parser = require('args-parser');
const args = parser(process.argv);

function createWindow() {
    const win = mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
        minWidth: 600,
        minHeight: 700,
        transparent: true,
        frame: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hiddenInset',
        backgroundColor: "rgba(0, 0, 0, 0)",
        icon: path.join(__dirname, "sail-logo.png"),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.webContents.openDevTools();

    if (args.serve != undefined) {
        console.log('SERVE');
        let port = args.port ? args.port : 4200;
        win.loadURL(`http://localhost:${port}`);
    } else {
        win.loadFile("./dist/www/index.html");
    }
}

app.on('window-all-closed', () => {
    // if(updating) return;
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
});

ipcMain.on("maximize-window", () => {
    mainWindow.maximize();
});

ipcMain.on("unmaximize-window", () => {
    mainWindow.unmaximize();
});

ipcMain.on("close-window", () => {
    mainWindow.close();
});

app.whenReady().then(createWindow);