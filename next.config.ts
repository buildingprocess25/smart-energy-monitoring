import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV === "development"

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
]

// Asset files skip proxy.ts, which sets the CSP of every other response.
const assetHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'",
  },
]

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/assets/:path*", headers: assetHeaders },
      { source: "/api/assets/:path*", headers: assetHeaders },
    ]
  },
}

export default nextConfig
