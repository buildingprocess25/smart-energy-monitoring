import 'server-only'

export class TelemetryApiError extends Error {}

// Server-only base URL of the smart-energy-meter-vps API (ends with /api).
function telemetryApiBase(): string | null {
  const url = process.env.TELEMETRY_API_URL || process.env.NEXT_PUBLIC_TELEMETRY_API_URL
  return url ? url.replace(/\/+$/, '') : null
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
    const res = await fetch(`${base}${path}`, { signal: controller.signal, cache: 'no-store' })
    if (!res.ok) throw new TelemetryApiError(`Server IoT menjawab ${res.status}.`)
    return await res.json()
  } catch (error) {
    if (error instanceof TelemetryApiError) throw error
    throw new TelemetryApiError('Server IoT tidak bisa dihubungi.')
  } finally {
    clearTimeout(timer)
  }
}
