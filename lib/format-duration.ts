const UNITS = [
  { label: 'hari', minutes: 1440 },
  { label: 'jam', minutes: 60 },
  { label: 'menit', minutes: 1 },
]

export function formatDuration(ms: number): string {
  let rest = Math.floor(ms / 60_000)
  if (rest < 1) return 'kurang dari 1 menit'
  const parts: string[] = []
  for (const { label, minutes } of UNITS) {
    const count = Math.floor(rest / minutes)
    rest -= count * minutes
    if (count > 0) parts.push(`${count} ${label}`)
    else if (parts.length > 0) break
    if (parts.length === 2) break
  }
  return parts.join(' ')
}
