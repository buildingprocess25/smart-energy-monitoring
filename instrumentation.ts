// Fills the energy index at startup so the first visitor does not wait for the full read,
// and starts the report scheduler and the myECO recorder.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return
  const { getEnergyIndex } = await import('@/lib/services/energy-service')
  const { startReportScheduler } = await import('@/lib/services/report-mail-service')
  startReportScheduler()
  const { startMyEcoRecorder } = await import('@/lib/services/myeco-service')
  startMyEcoRecorder()
  getEnergyIndex().catch((error) => console.error('Error warming energy index:', error))
}
