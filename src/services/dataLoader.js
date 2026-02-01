export async function loadJson(path) {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`Failed to load ${path} (HTTP ${res.status})`)
  }
  return res.json()
}
