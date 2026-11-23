// Runs one SELECT so it cannot write and cannot hold the database for long.
// Postgres rejects any write inside READ ONLY, and statement_timeout ends a slow query.
// No imports, so `node --test` can load this file directly.

export const SESSION_QUERY_TIMEOUT_MS = 15_000

export interface QueryClient {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>
  release(err?: boolean | Error): void
}

export interface QueryPool {
  connect(): Promise<QueryClient>
}

export async function readOnlyQuery<R>(
  pool: QueryPool,
  text: string,
  values: unknown[],
  timeoutMs = SESSION_QUERY_TIMEOUT_MS
): Promise<{ rows: R[] }> {
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeout harus bilangan bulat positif.')
  }
  const client = await pool.connect()
  // A client whose ROLLBACK failed may still be inside a transaction: destroy it
  // instead of handing it back to the pool Flask's database shares.
  let destroy = false
  try {
    await client.query('BEGIN READ ONLY')
    // timeoutMs is a checked integer constant, never request input.
    await client.query(`SET LOCAL statement_timeout = ${timeoutMs}`)
    const res = await client.query(text, values)
    await client.query('COMMIT')
    return { rows: res.rows as R[] }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {
      destroy = true
    })
    throw error
  } finally {
    if (destroy) client.release(true)
    else client.release()
  }
}
