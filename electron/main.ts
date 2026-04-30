import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import Store from "electron-store";

const store = new Store();
let nextProcess: ChildProcess | null = null;
const PORT = 3000;

ipcMain.handle("store-get", (_, key) => store.get(key));
ipcMain.handle("store-set", (_, key, value) => store.set(key, value));
ipcMain.handle("store-delete", (_, key) => store.delete(key));
ipcMain.handle("store-get-all", () => store.store);

function startNextServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const projectRoot = path.join(__dirname, "../..");
    const isPackaged = app.isPackaged;

    nextProcess = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["next", "start", "-p", String(PORT)],
      { cwd: projectRoot, shell: true }
    );

    const timeout = setTimeout(() => reject(new Error("Next.js server timeout")), 30000);

    nextProcess.stdout?.on("data", (data: Buffer) => {
      const output = data.toString();
      console.log("[next]", output);
      if (output.includes(`${PORT}`)) {
        clearTimeout(timeout);
        resolve();
      }
    });

    nextProcess.stderr?.on("data", (data: Buffer) => {
      console.error("[next]", data.toString());
    });

    nextProcess.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
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
  if (nextProcess) {
    nextProcess.kill();
    nextProcess = null;
  }
});
