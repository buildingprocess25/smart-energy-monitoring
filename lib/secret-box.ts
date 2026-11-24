// AES-256-GCM for the SMTP password. No `@/` imports, so `node --test` can load this file directly.
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto'

export interface SealedSecret {
  iv: string
  tag: string
  data: string
}

export const isSecretKey = (key: string | undefined): key is string => (key?.trim().length ?? 0) >= 32

const derive = (key: string) => Buffer.from(hkdfSync('sha256', key.trim(), '', 'smart-energy-monitoring smtp', 32))

// `context` is bound to the secret: it does not open for another server or account.
export function sealSecret(text: string, key: string, context: string): SealedSecret {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', derive(key), iv).setAAD(Buffer.from(context))
  const data = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') }
}

export function openSecret(sealed: SealedSecret | null, key: string, context: string): string | null {
  if (!sealed) return null
  try {
    const tag = Buffer.from(sealed.tag, 'base64')
    if (tag.length !== 16) return null
    const decipher = createDecipheriv('aes-256-gcm', derive(key), Buffer.from(sealed.iv, 'base64'))
    decipher.setAAD(Buffer.from(context)).setAuthTag(tag)
    return Buffer.concat([decipher.update(Buffer.from(sealed.data, 'base64')), decipher.final()]).toString('utf8')
  } catch {
    return null
  }
}
