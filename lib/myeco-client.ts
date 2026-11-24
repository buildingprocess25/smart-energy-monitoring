// Reads the myECO Open API: API key -> one-hour bearer token -> GET.
// No imports, so `node --test` can load this file directly.

export type MyEcoErrorKind = 'unconfigured' | 'auth' | 'blocked' | 'unreachable'

// Messages are fixed, so a key or token in an upstream error never reaches a log.
export class MyEcoError extends Error {
  kind: MyEcoErrorKind
  constructor(kind: MyEcoErrorKind) {
    super(`myECO: ${kind}`)
    this.kind = kind
  }
}

interface Reply {
  ok: boolean
  status: number
  json: () => Promise<unknown>
}

export interface MyEcoClientOptions {
  baseUrl: string
  apiKey: string
  fetchFn?: (url: string, init: RequestInit) => Promise<Reply>
  now?: () => number
  timeoutMs?: number
}

const RENEW_BEFORE_MS = 5 * 60_000

export function createMyEcoClient({
  baseUrl,
  apiKey,
  fetchFn = fetch,
  now = Date.now,
  timeoutMs = 8000,
}: MyEcoClientOptions): (path: string) => Promise<unknown> {
  let token: { value: string; expiresAt: number } | null = null
  let pending: Promise<string> | null = null

  async function send(path: string, init: RequestInit): Promise<Reply> {
    try {
      return await fetchFn(`${baseUrl}${path}`, {
        ...init,
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch {
      throw new MyEcoError('unreachable')
    }
  }

  async function body(reply: Reply): Promise<unknown> {
    try {
      return await reply.json()
    } catch {
      throw new MyEcoError('unreachable')
    }
  }

  async function requestToken(): Promise<string> {
    const reply = await send('/auth/open/auth/token', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (reply.status === 403) throw new MyEcoError('blocked')
    if (reply.status === 401) throw new MyEcoError('auth')
    if (!reply.ok) throw new MyEcoError('unreachable')
    const { data } = ((await body(reply)) ?? {}) as { data?: { access_token?: unknown; expires_in?: unknown } }
    if (typeof data?.access_token !== 'string') throw new MyEcoError('unreachable')
    token = { value: data.access_token, expiresAt: now() + (Number(data.expires_in) || 600) * 1000 }
    return token.value
  }

  function getToken(): Promise<string> {
    if (token && token.expiresAt - now() > RENEW_BEFORE_MS) return Promise.resolve(token.value)
    pending ??= requestToken().finally(() => {
      pending = null
    })
    return pending
  }

  return async function get(path: string): Promise<unknown> {
    if (!apiKey) throw new MyEcoError('unconfigured')
    for (let attempt = 0; ; attempt++) {
      const value = await getToken()
      const reply = await send(path, { headers: { Authorization: `Bearer ${value}` } })
      if (reply.status === 401 && attempt === 0) {
        // Only drop the token that failed; another call may have renewed it already.
        if (token?.value === value) token = null
        continue
      }
      if (reply.status === 401) throw new MyEcoError('auth')
      if (reply.status === 403) throw new MyEcoError('blocked')
      if (!reply.ok) throw new MyEcoError('unreachable')
      return body(reply)
    }
  }
}
