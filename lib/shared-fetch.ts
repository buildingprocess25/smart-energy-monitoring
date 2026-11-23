// Shared cache that caps how often a slow upstream is called, whatever the number of viewers.
// No imports, so `node --test` can load this file directly.

export interface SharedFetchOptions {
  ttlMs: number
  // After a failed load, the key is not loaded again for this long.
  failureBackoffMs: number
  maxKeys?: number
  now?: () => number
}

export class BackoffError extends Error {}

type Entry<T> = { value?: T; at: number; failedAt?: number; inflight?: Promise<T> }

export function createSharedFetch<T>(
  load: (key: string) => Promise<T>,
  options: SharedFetchOptions
): (key: string) => Promise<T> {
  const entries = new Map<string, Entry<T>>()
  const now = options.now ?? Date.now
  const maxKeys = options.maxKeys ?? 500

  function remember(key: string, entry: Entry<T>) {
    entries.delete(key)
    entries.set(key, entry)
    while (entries.size > maxKeys) {
      const oldest = entries.keys().next().value as string
      entries.delete(oldest)
    }
  }

  return function get(key: string): Promise<T> {
    const entry = entries.get(key)
    const t = now()
    if (entry?.inflight) return entry.inflight
    if (entry && entry.failedAt === undefined && t - entry.at < options.ttlMs) {
      return Promise.resolve(entry.value as T)
    }
    if (entry?.failedAt !== undefined && t - entry.failedAt < options.failureBackoffMs) {
      return Promise.reject(new BackoffError('Sumber data sedang dijeda setelah gagal.'))
    }

    const inflight = load(key).then(
      (value) => {
        remember(key, { value, at: now() })
        return value
      },
      (error) => {
        remember(key, { at: 0, failedAt: now() })
        throw error
      }
    )
    remember(key, { at: 0, inflight })
    return inflight
  }
}
