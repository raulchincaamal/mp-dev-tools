import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Store from "electron-store";

const store = new Store();

ipcMain.handle("store-get", (_, key) => store.get(key));
ipcMain.handle("store-set", (_, key, value) => store.set(key, value));
ipcMain.handle("store-delete", (_, key) => store.delete(key));
ipcMain.handle("store-get-all", () => store.store);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "../../out/index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
