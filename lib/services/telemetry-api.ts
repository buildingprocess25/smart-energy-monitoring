import 'server-only'

export class TelemetryApiError extends Error {}

// Server-only base URL of the smart-energy-meter-vps API (ends with /api).
function telemetryApiBase(): string | null {
  const url = process.env.TELEMETRY_API_URL || process.env.NEXT_PUBLIC_TELEMETRY_API_URL
  return url ? url.replace(/\/+$/, '') : null
}

// The same value as PORTAL_CONTROL_TOKEN in Flask. Never sent to the browser.
function tokenHeaders(): Record<string, string> {
  const token = process.env.PORTAL_CONTROL_TOKEN?.trim()
  return token ? { 'X-Portal-Token': token } : {}
}

// NEXT_PUBLIC_* is inlined at `next build`, and the production image is built without it,
// so production needs TELEMETRY_API_URL in the runtime environment.
let missingBaseLogged = false

export async function fetchTelemetryApi(path: string, timeoutMs = 3000): Promise<unknown> {
  const base = telemetryApiBase()
  if (!base) {
    if (!missingBaseLogged) {
      missingBaseLogged = true
      console.error('TELEMETRY_API_URL is not set; live data from the IoT server is unavailable.')
    }
    throw new TelemetryApiError('TELEMETRY_API_URL belum diisi.')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${base}${path}`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: tokenHeaders(),
    })
    if (!res.ok) throw new TelemetryApiError(`Server IoT menjawab ${res.status}.`)
    return await res.json()
  } catch (error) {
    if (error instanceof TelemetryApiError) throw error
    throw new TelemetryApiError('Server IoT tidak bisa dihubungi.')
  } finally {
    clearTimeout(timer)
  }
}

// Local environments point at the production Flask server, so control needs the token on purpose.
export function isControlConfigured(): boolean {
  return (process.env.PORTAL_CONTROL_TOKEN?.trim().length ?? 0) >= 16
}

export interface TelemetryReply {
  status: number
  body: Record<string, unknown>
}

// Sends one command and never repeats it: a timeout leaves the outcome unknown, so callers check the state.
export async function sendTelemetryCommand(
  path: string,
  payload: Record<string, unknown>,
  timeoutMs = 10_000
): Promise<TelemetryReply> {
  const base = telemetryApiBase()
  if (!base) throw new TelemetryApiError('TELEMETRY_API_URL belum diisi.')
  try {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...tokenHeaders() },
      body: JSON.stringify(payload),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(timeoutMs),
    })
    const body: unknown = await res.json().catch(() => null)
    return {
      status: res.status,
      body: typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {},
    }
  } catch {
    throw new TelemetryApiError('Server IoT tidak menjawab.')
  }
}
