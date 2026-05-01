import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Store from "electron-store";
import next from "next";
import http from "http";

const store = new Store();
const PORT = 3000;
let server: http.Server | null = null;

ipcMain.handle("store-get", (_, key) => store.get(key));
ipcMain.handle("store-set", (_, key, value) => store.set(key, value));
ipcMain.handle("store-delete", (_, key) => store.delete(key));
ipcMain.handle("store-get-all", () => store.store);

function getNextDir(): string {
  if (app.isPackaged) {
    return path.join(app.getAppPath());
  }
  return path.join(__dirname, "../..");
}

async function startNextServer(): Promise<void> {
  const dir = getNextDir();
  const nextApp = next({ dev: false, dir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  return new Promise((resolve) => {
    server = http.createServer((req, res) => handle(req, res));
    server.listen(PORT, () => {
      console.log(`Next.js server running on http://localhost:${PORT}`);
      resolve();
    });
  });
}

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

  win.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (err) {
    console.error("Failed to start Next.js server:", err);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("before-quit", () => {
  if (server) {
    server.close();
    server = null;
  }
});
