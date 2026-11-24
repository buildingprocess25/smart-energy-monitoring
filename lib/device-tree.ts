// Branch > store > main panel and sub-meters. No imports, so `node --test` can load it.

export interface TreeSensor {
  deviceId: string
  phase: string
  name: string
  kwh: number | null // null when nothing was recorded in the period
}

export interface TreeDevice {
  id: string
  online: boolean
  storeId: string | null
  storeCode: string | null
  storeName: string | null
  branch: string | null
  sensors: { phase: string; name: string; isMain: boolean; kwh: number | null }[]
}

export interface TreeStore {
  key: string
  hasStore: boolean
  code: string | null
  name: string
  deviceCount: number
  onlineCount: number
  mainKwh: number | null
  main: TreeSensor[]
  sub: TreeSensor[]
}

export interface TreeBranch {
  name: string
  mainKwh: number | null
  stores: TreeStore[]
}

const NO_STORE = 'Belum terhubung ke toko'

function total(values: (number | null)[]): number | null {
  const known = values.filter((v): v is number => v !== null)
  return known.length > 0 ? known.reduce((sum, v) => sum + v, 0) : null
}

export function buildDeviceTree(devices: TreeDevice[]): TreeBranch[] {
  const branches = new Map<string, Map<string, TreeStore>>()
  for (const device of devices) {
    const branchName = device.storeId ? device.branch || 'Tanpa cabang' : NO_STORE
    let stores = branches.get(branchName)
    if (!stores) branches.set(branchName, (stores = new Map()))
    const key = device.storeId ?? device.id
    let store = stores.get(key)
    if (!store) {
      store = {
        key,
        hasStore: device.storeId !== null,
        code: device.storeCode,
        name: device.storeName ?? device.id,
        deviceCount: 0,
        onlineCount: 0,
        mainKwh: null,
        main: [],
        sub: [],
      }
      stores.set(key, store)
    }
    store.deviceCount += 1
    if (device.online) store.onlineCount += 1
    for (const { isMain, ...sensor } of device.sensors) {
      const group = isMain ? store.main : store.sub
      group.push({ deviceId: device.id, ...sensor })
    }
  }

  return [...branches.entries()]
    .map(([name, map]) => {
      const stores = [...map.values()]
        .map((s) => ({ ...s, mainKwh: total(s.main.map((m) => m.kwh)) }))
        .sort((a, b) => a.name.localeCompare(b.name, 'id'))
      return { name, mainKwh: total(stores.map((s) => s.mainKwh)), stores }
    })
    .sort((a, b) => Number(a.name === NO_STORE) - Number(b.name === NO_STORE) || a.name.localeCompare(b.name, 'id'))
}
