import pg from 'pg'

const { Pool } = pg

// Global pool caching in development to avoid exhausting connections
declare global {
  var _spartaPool: pg.Pool | undefined
  var _telemetryPool: pg.Pool | undefined
  var _aivenPool: pg.Pool | undefined
}

function createPoolConfig(rawUrl: string): pg.PoolConfig {
  const isSslDisabled = rawUrl.includes('sslmode=disable')
  const connectionString = rawUrl
    .replace('?sslmode=require', '')
    .replace('&sslmode=require', '')
    .replace('?sslmode=disable', '')
    .replace('&sslmode=disable', '')

  return {
    connectionString,
    ...(isSslDisabled
      ? {}
      : {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }
}

export function getSpartaPool(): pg.Pool {
  if (!global._spartaPool) {
    const connectionString = process.env.SPARTA_DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing environment variable: SPARTA_DATABASE_URL')
    }

    global._spartaPool = new Pool(createPoolConfig(connectionString))
  }
  return global._spartaPool
}

export function getTelemetryPool(): pg.Pool {
  if (!global._telemetryPool) {
    const connectionString =
      process.env.TELEMETRY_DATABASE_URL ||
      process.env.DATABASE_URL ||
      process.env.AIVEN_DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing environment variable: TELEMETRY_DATABASE_URL')
    }

    global._telemetryPool = new Pool(createPoolConfig(connectionString))
  }
  return global._telemetryPool
}

// Alias for backwards compatibility
export const getAivenPool = getTelemetryPool
