import { SESSION_COOKIE } from './access-rules.ts'
import { spartaHref } from '../sparta-url.ts'

const REVOKE_TIMEOUT_MS = 4000

type Fetch = (url: string, init: RequestInit) => Promise<{ ok: boolean }>

// sparta owns the session table and deletes the row for the token in this cookie.
export async function revokeSpartaSession(
  base: string | null | undefined,
  token: string,
  fetchImpl: Fetch = fetch
): Promise<boolean> {
  const url = spartaHref(base, '/api/auth/sign-out')
  if (!url) return false
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { cookie: `${SESSION_COOKIE}=${encodeURIComponent(token)}` },
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(REVOKE_TIMEOUT_MS),
    })
    return res.ok
  } catch {
    return false
  }
}
