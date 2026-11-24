import type { Store } from './types.ts'

type Choice = Pick<Store, 'status' | 'deviceId'>

// A requested store is never replaced by another one; only a page that asked for none gets a default.
// Without a device there is nothing to analyse.
export function analyticsStore<T extends Choice>(requested: boolean, found: T | null, stores: T[]): T | null {
  const withDevice = stores.filter((s) => s.deviceId)
  const store = requested ? found : (withDevice.find((s) => s.status === 'live') ?? withDevice[0] ?? null)
  return store?.deviceId ? store : null
}
