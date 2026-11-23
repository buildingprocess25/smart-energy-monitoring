// Stale-while-revalidate: once loaded, an expired entry is served at once and refreshed in the background.
// No imports, so `node --test` can load this file directly.

export interface StaleCacheOptions {
  ttlMs: number
  maxKeys?: number
  now?: () => number
  // A failed background refresh keeps the old value; this only reports the error.
  onError?: (error: unknown) => void
}

type Entry<T> = { value?: T; at: number; hasValue: boolean; inflight?: Promise<T> }

export function createStaleCache<T>(options: StaleCacheOptions) {
  const entries = new Map<string, Entry<T>>()
  const now = options.now ?? Date.now
  const maxKeys = options.maxKeys ?? 100

  function remember(key: string, entry: Entry<T>) {
    entries.delete(key)
    entries.set(key, entry)
    while (entries.size > maxKeys) {
      entries.delete(entries.keys().next().value as string)
    }
  }

  return function get(key: string, load: () => Promise<T>): Promise<T> {
    const entry = entries.get(key)

    if (entry?.hasValue) {
      if (now() - entry.at >= options.ttlMs && !entry.inflight) {
        const refresh = load()
        entry.inflight = refresh
        refresh.then(
          (value) => remember(key, { value, at: now(), hasValue: true }),
          (error) => {
            entry.inflight = undefined
            options.onError?.(error)
          }
        )
      }
      return Promise.resolve(entry.value as T)
    }

    if (entry?.inflight) return entry.inflight

    const first = load()
    remember(key, { at: 0, hasValue: false, inflight: first })
    first.then(
      (value) => remember(key, { value, at: now(), hasValue: true }),
      () => entries.delete(key)
    )
    return first
  }
}
