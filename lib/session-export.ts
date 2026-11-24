// No `@/` imports, so `node --test` can load this file directly.
import type { SessionRecordsResult } from './types.ts'
import type { Sheet } from './xlsx.ts'
import { summarizeSession } from './session-records.ts'

const round = (value: number, digits: number) => Number(value.toFixed(digits))

export function sessionSheets({ session, phases }: SessionRecordsResult): Sheet[] {
  const stats = summarizeSession(phases)
  return [
    {
      name: 'Ringkasan',
      rows: [
        ['Nama sesi', session.name],
        ['Perangkat', session.deviceName],
        ['Sensor', phases.map((p) => p.name).join(', ')],
        ['Mulai', session.startTime],
        ['Selesai', session.endTime ?? '-'],
        ['Jumlah record', stats.totalRecords],
        ['Record online', stats.onlineRecords],
        ['Record offline', stats.offlineRecords],
        [],
        ['Rata-rata record online semua sensor', null],
        ['Tegangan (V)', round(stats.avgVoltage, 2)],
        ['Arus (A)', round(stats.avgCurrent, 2)],
        ['Daya (W)', round(stats.avgPower, 2)],
        ['Frekuensi (Hz)', round(stats.avgFrequency, 1)],
        ['Faktor daya', round(stats.avgPowerFactor, 4)],
        ['Energi (kWh)', round(stats.energyKwh, 4)],
      ],
    },
    ...phases.map((p) => ({
      name: p.name,
      rows: [
        ['Waktu (WIB)', 'Status', 'Tegangan (V)', 'Arus (A)', 'Daya (W)', 'Frekuensi (Hz)', 'Faktor daya', 'Counter energi (kWh)'],
        ...p.records.map((r) => [
          r.timestamp, r.offline ? 'Offline' : 'Online', r.voltage, r.current, r.power, r.frequency, r.powerFactor, r.energy,
        ]),
      ],
    })),
  ]
}

export function exportFileName(sessionName: string): string {
  return `${sessionName.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 80) || 'sesi'}.xlsx`
}
