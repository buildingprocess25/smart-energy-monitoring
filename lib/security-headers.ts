// No imports, so `node --test` can load this file directly.

function httpOrigin(url: string | null | undefined): string {
  try {
    const parsed = new URL(url ?? '')
    return /^https?:$/.test(parsed.protocol) ? parsed.origin : ''
  } catch {
    return ''
  }
}

// Built per request in proxy.ts because the sparta URL is only known at runtime.
// Next.js injects inline scripts without a nonce, so 'unsafe-inline' stays for scripts;
// Leaflet and Recharts set inline styles. Dev needs 'unsafe-eval' for fast refresh.
export function contentSecurityPolicy(spartaUrl: string | null | undefined, isDev: boolean): string {
  // The sign-out POSTs to sparta, so its origin must be reachable from the page.
  const spartaOrigin = httpOrigin(spartaUrl)
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://tile.openstreetmap.org",
    "font-src 'self' data:",
    `connect-src 'self'${spartaOrigin ? ` ${spartaOrigin}` : ''}${isDev ? ' ws:' : ''}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ')
}
