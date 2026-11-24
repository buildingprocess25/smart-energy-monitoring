const MAX_BYTES = 60_000

// null for a body that is too long or not JSON.
export async function readJsonBody(request: Request): Promise<unknown> {
  const text = await request.text()
  if (text.length > MAX_BYTES) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
