function getStore() {
  return window.electronAPI.store;
}

export async function resolveVariables(template: string): Promise<string> {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return template;

  const s = getStore();
  let result = template;
  for (const match of matches) {
    const key = match.slice(2, -2);
    const value = await s.get(key);
    result = result.replaceAll(match, value != null ? String(value) : match);
  }
  return result;
}

export { getStore as store };
