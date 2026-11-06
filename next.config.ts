import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV === "development"

function originOf(url: string | undefined): string {
  try {
    return url ? new URL(url).origin : ""
  } catch {
    return ""
  }
}

// The sidebar's sign-out POSTs to sparta, so its origin must be reachable from the page.
const spartaOrigin = originOf(process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL)

// Next.js injects inline scripts without a nonce, so 'unsafe-inline' stays for scripts;
// Leaflet and Recharts set inline styles. Dev needs 'unsafe-eval' for fast refresh.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org",
  "font-src 'self' data:",
  `connect-src 'self'${spartaOrigin ? ` ${spartaOrigin}` : ""}${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
]

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
