interface ElectronStore {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
  getAll: () => Promise<Record<string, unknown>>;
}

interface ElectronAPI {
  platform: string;
  store: ElectronStore;
}

interface Window {
  electronAPI: ElectronAPI;
}
