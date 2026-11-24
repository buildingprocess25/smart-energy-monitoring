import 'server-only'
import { buildDeviceTree, type TreeBranch } from '@/lib/device-tree'
import { jakartaDate } from '@/lib/jakarta-range'
import { comparePhase, defaultPhaseName, isExcludedPhase, normalizePhaseKey } from '@/lib/phase-keys'
import { getManagedDevices } from '@/lib/services/device-service'
import { getEnergyIndex } from '@/lib/services/energy-service'
import { getStores } from '@/lib/services/store-service'
import { sessionStore } from '@/lib/store-code'

const MAIN_PHASES = new Set(['R', 'S', 'T'])

// Both getManagedDevices() and getStores() are already limited to the viewer's scope.
export async function getDeviceTree(): Promise<{ month: string; branches: TreeBranch[] }> {
  const [devices, stores, index] = await Promise.all([getManagedDevices(), getStores(), getEnergyIndex()])
  const month = jakartaDate(Date.now()).slice(0, 7)

  const branches = buildDeviceTree(
    devices.map((device) => {
      const link = sessionStore(device.id, device.name, stores)
      const kwhByPhase = new Map<string, number>()
      for (const day of index.daily(device.id)) {
        if (!day.date.startsWith(month)) continue
        for (const [phase, kwh] of Object.entries(day.phases)) {
          kwhByPhase.set(phase, (kwhByPhase.get(phase) ?? 0) + kwh)
        }
      }
      const names = new Map<string, string>()
      for (const sensor of device.sensors) {
        if (!sensor.enabled || isExcludedPhase(sensor.phase)) continue
        names.set(normalizePhaseKey(sensor.phase), sensor.name)
      }
      for (const phase of kwhByPhase.keys()) {
        // A main phase that was recorded counts in the total, so it is listed even when it is switched off.
        if (MAIN_PHASES.has(phase) && !names.has(phase)) names.set(phase, defaultPhaseName(phase))
      }
      return {
        id: device.id,
        online: device.online,
        storeId: link.storeId,
        storeCode: link.storeCode,
        storeName: link.storeName,
        branch: stores.find((s) => s.id === link.storeId)?.branch ?? null,
        sensors: [...names.entries()]
          .sort(([a], [b]) => comparePhase(a, b))
          .map(([phase, name]) => ({
            phase,
            name,
            isMain: MAIN_PHASES.has(phase),
            kwh: kwhByPhase.get(phase) ?? null,
          })),
      }
    })
  )
  return { month, branches }
}
