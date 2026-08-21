import pg from 'pg'

const { Pool } = pg

// Global pool caching in development to avoid exhausting connections
declare global {
  var _spartaPool: pg.Pool | undefined
  var _aivenPool: pg.Pool | undefined
}

export function getSpartaPool(): pg.Pool {
  if (!global._spartaPool) {
    const connectionString = process.env.SPARTA_DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing environment variable: SPARTA_DATABASE_URL')
    }

    global._spartaPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }
  return global._spartaPool
}

export function getAivenPool(): pg.Pool {
  if (!global._aivenPool) {
    let connectionString = process.env.AIVEN_DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing environment variable: AIVEN_DATABASE_URL')
    }

    connectionString = connectionString.replace('?sslmode=require', '').replace('&sslmode=require', '')

    global._aivenPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }
  return global._aivenPool
}
