// Day files of power samples on the report volume: this app may not write to either database.
// No `@/` imports, so `node --test` can load this file directly.
import { appendFile, mkdir, readdir, readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { jakartaDate } from './jakarta-range.ts'
import type { PowerSample } from './myeco.ts'
import { datesBetween, decodeSamples, encodeSamples, expiredFiles, fileName, mergeSamples } from './myeco-samples.ts'

export interface MyEcoArchive {
  append: (samples: PowerSample[]) => Promise<void>
  read: (from: number, to: number) => Promise<PowerSample[]>
  removeExpired: (now: number) => Promise<void>
}

export function createMyEcoArchive(baseDir: string): MyEcoArchive {
  const dir = path.join(/* turbopackIgnore: true */ baseDir, 'myeco')
  const file = (name: string) => path.join(/* turbopackIgnore: true */ dir, name)

  return {
    async append(samples) {
      await mkdir(dir, { recursive: true })
      const byDate = new Map<string, PowerSample[]>()
      for (const sample of samples) {
        const date = jakartaDate(sample.at)
        byDate.set(date, [...(byDate.get(date) ?? []), sample])
      }
      for (const [date, list] of byDate) await appendFile(file(fileName(date)), encodeSamples(list), { mode: 0o600 })
    },

    async read(from, to) {
      const lists = await Promise.all(
        datesBetween(from, to).map(async (date) => {
          try {
            return decodeSamples(await readFile(file(fileName(date)), 'utf8'))
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
            throw error
          }
        })
      )
      return mergeSamples(...lists).filter((s) => s.at >= from && s.at <= to)
    },

    async removeExpired(now) {
      let names: string[]
      try {
        names = await readdir(dir)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
        throw error
      }
      for (const name of expiredFiles(names, now)) {
        await unlink(file(name)).catch((error: NodeJS.ErrnoException) => {
          // Another container may have removed it first.
          if (error.code !== 'ENOENT') throw error
        })
      }
    },
  }
}
