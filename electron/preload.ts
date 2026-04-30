import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  store: {
    get: (key: string) => ipcRenderer.invoke("store-get", key),
    set: (key: string, value: unknown) => ipcRenderer.invoke("store-set", key, value),
    delete: (key: string) => ipcRenderer.invoke("store-delete", key),
    getAll: () => ipcRenderer.invoke("store-get-all"),
  },
});
