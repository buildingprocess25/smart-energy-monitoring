import type { Store } from './types.ts'

type Energy = Pick<Store, 'kwhTotal' | 'energyBasis'>

export function formatKwh(kwh: number): string {
  return kwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })
}

// '-' when no reading is available, so a failed load never looks like 0 kWh.
export function formatStoreKwh(store: Energy): string {
  return store.energyBasis === 'none' ? '-' : formatKwh(store.kwhTotal)
}

// Sub-meters measure part of a store, so only main panels add up to a total.
export function mainPanelKwh(stores: Energy[]): number {
  return stores.reduce((sum, s) => sum + (s.energyBasis === 'main' ? s.kwhTotal : 0), 0)
}
