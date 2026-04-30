"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { store as getStore, resolveVariables } from "@/lib/store";

interface Variable {
  key: string;
  value: string;
}

export function VariableDemo() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [template, setTemplate] = useState("{{API_URL}}/users/{{USER_ID}}");
  const [resolved, setResolved] = useState("");

  useEffect(() => {
    loadVariables();
  }, []);

  async function loadVariables() {
    const all = (await getStore().getAll()) as Record<string, string>;
    setVariables(Object.entries(all).map(([key, value]) => ({ key, value: String(value) })));
  }

  async function addVariable() {
    if (!newKey.trim()) return;
    await getStore().set(newKey, newValue);
    setNewKey("");
    setNewValue("");
    loadVariables();
  }

  async function removeVariable(key: string) {
    await getStore().delete(key);
    loadVariables();
  }

  async function resolve() {
    setResolved(await resolveVariables(template));
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <h2 className="text-2xl font-bold">Variables</h2>

      {/* Agregar variable */}
      <div className="flex gap-2">
        <Input placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
        <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
        <Button onClick={addVariable}>Agregar</Button>
      </div>

      {/* Lista de variables */}
      <div className="flex flex-col gap-2">
        {variables.map((v) => (
          <Card key={v.key}>
            <CardContent className="flex items-center justify-between py-2">
              <span>
                <span className="font-mono text-amber-400">{`{{${v.key}}}`}</span>
                {" = "}
                <span className="text-neutral-300">{v.value}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={() => removeVariable(v.key)}>
                ✕
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resolver template */}
      <div className="flex flex-col gap-2">
        <Label>Template</Label>
        <Input
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="{{API_URL}}/users/{{USER_ID}}"
          className="font-mono"
        />
        <Button onClick={resolve}>Resolver</Button>
        {resolved && (
          <Card>
            <CardContent className="py-2 font-mono text-green-400">{resolved}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
