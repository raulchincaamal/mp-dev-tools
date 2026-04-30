"use client";

import { VariableDemo } from "@/components/variable-demo";
import { ServerActionDemo } from "@/components/server-action-demo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-amber-950 py-10">
      <h1 className="mb-8 text-4xl font-bold">MP Dev Tools</h1>
      <div className="flex w-full max-w-2xl flex-col gap-10">
        <ServerActionDemo />
        <VariableDemo />
      </div>
    </main>
  );
}
