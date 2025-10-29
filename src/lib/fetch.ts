export async function apiGet(path: string, init?: RequestInit) {
  const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("API_URL not configured");
  const res = await fetch(`${base}${path}`, {
    ...init,
    next: init?.next,
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}


