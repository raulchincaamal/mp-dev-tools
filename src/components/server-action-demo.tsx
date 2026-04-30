"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSystemInfo } from "@/app/actions/system";

type SystemInfo = Awaited<ReturnType<typeof getSystemInfo>>;

export function ServerActionDemo() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const data = await getSystemInfo();
    setInfo(data);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Server Action Demo</h2>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Cargando..." : "Obtener info del sistema"}
      </Button>

      {info && (
        <Card>
          <CardContent className="flex flex-col gap-1 py-3 font-mono text-sm">
            <p>Plataforma: {info.platform}</p>
            <p>Hostname: {info.hostname}</p>
            <p>Uptime: {info.uptime}</p>
            <p>CPUs: {info.cpus}</p>
            <p>RAM total: {info.totalMemory}</p>
            <p>RAM libre: {info.freeMemory}</p>
            <p className="mt-2 font-bold">Archivos en home (primeros 10):</p>
            {info.homeFiles.map((f) => (
              <p key={f.name}>
                {f.isDir ? "📁" : "📄"} {f.name}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
