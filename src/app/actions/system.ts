"use server";

import { readdir } from "fs/promises";
import { join } from "path";
import os from "os";

export async function getSystemInfo() {
  const homeDir = os.homedir();
  const files = await readdir(join(homeDir), { withFileTypes: true });

  return {
    platform: os.platform(),
    hostname: os.hostname(),
    uptime: `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
    totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    cpus: os.cpus().length,
    homeFiles: files.slice(0, 10).map((f) => ({
      name: f.name,
      isDir: f.isDirectory(),
    })),
  };
}
