// No imports, so `node --test` can load this file directly.

const CODE_PATTERN = /[(\[]\s*([A-Za-z0-9_-]+)\s*[)\]]/

// "Dc Cianjur ( 2JC2 )" -> "2JC2", "EM-0002 [TI90] RUKO ELEVEE" -> "TI90"
export function extractStoreCode(deviceName: string): string | null {
  return deviceName?.match(CODE_PATTERN)?.[1].toUpperCase() ?? null
}

export interface SessionStore {
  storeId: string | null
  storeCode: string | null
  storeName: string | null
}

// Devices move between stores, so the name recorded with the session decides which store it belongs to.
export function sessionStore(
  deviceId: string,
  deviceName: string,
  stores: { id: string; code: string; name: string; deviceId?: string }[]
): SessionStore {
  const code = extractStoreCode(deviceName)
  const store = code
    ? stores.find((s) => s.code.toUpperCase() === code)
    : stores.find((s) => s.deviceId === deviceId)
  if (store) return { storeId: store.id, storeCode: store.code, storeName: store.name }

  const label = code ? deviceName.split(CODE_PATTERN).at(-1)?.trim() : ''
  return { storeId: null, storeCode: code, storeName: label || null }
}
