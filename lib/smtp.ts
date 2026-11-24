// Small SMTP client. Always encrypted: implicit TLS (465) or STARTTLS (587).
// No `@/` imports, so `node --test` can load this file directly.
import net from 'node:net'
import tls from 'node:tls'
import { randomUUID } from 'node:crypto'

export interface SmtpConfig {
  host: string
  port: number
  user: string
  password: string
  implicitTls: boolean
}

export interface Mail {
  from: string
  fromName: string
  to: string[]
  subject: string
  text: string
  attachment: { name: string; data: Uint8Array } | null
}

// maybeSent: the server may have accepted the message, so sending again could duplicate it.
export class SmtpError extends Error {
  maybeSent: boolean
  constructor(message: string, maybeSent: boolean) {
    super(message)
    this.maybeSent = maybeSent
  }
}

export function parseAddress(raw: string): string | null {
  if (raw.length > 254 || !/^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(raw)) return null
  const at = raw.lastIndexOf('@')
  return raw.slice(0, at) + raw.slice(at).toLowerCase()
}

const oneLine = (text: string) => text.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim()
const wrap76 = (base64: string) => base64.match(/.{1,76}/g)?.join('\r\n') ?? ''

// RFC 2047, split so every encoded word stays under 75 characters.
function encodeWords(text: string): string {
  const words: string[] = []
  let part = ''
  for (const char of oneLine(text)) {
    if (Buffer.byteLength(part + char) > 36) {
      words.push(part)
      part = ''
    }
    part += char
  }
  words.push(part)
  return words.map((w) => `=?UTF-8?B?${Buffer.from(w).toString('base64')}?=`).join('\r\n ')
}

export function buildMime(mail: Mail, id: string, date: Date): string {
  const boundary = `b-${id}`
  const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  return [
    `From: ${encodeWords(mail.fromName)}`,
    ` <${mail.from}>`,
    // Recipients are only in the envelope, so they do not see each other.
    `To: <${mail.from}>`,
    `Subject: ${encodeWords(mail.subject)}`,
    `Date: ${date.toUTCString().replace('GMT', '+0000')}`,
    `Message-ID: <${id}@${mail.from.split('@')[1]}>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(Buffer.from(mail.text.replace(/\r?\n/g, '\r\n')).toString('base64')),
    ...(mail.attachment
      ? [
          `--${boundary}`,
          'Content-Type:',
          ` ${type}`,
          'Content-Transfer-Encoding: base64',
          'Content-Disposition: attachment;',
          ` filename="${mail.attachment.name.replace(/[^A-Za-z0-9._ -]/g, '_').slice(0, 60)}"`,
          '',
          wrap76(Buffer.from(mail.attachment.data).toString('base64')),
        ]
      : []),
    `--${boundary}--`,
    '',
  ].join('\r\n')
}

interface Connectors {
  connectTls?: (options: { host: string; port: number }) => net.Socket
  connectPlain?: (options: { host: string; port: number }) => net.Socket
  timeoutMs?: number
}

class Connection {
  private buffer = ''
  private failure: Error | null = null
  private wake: (() => void) | null = null
  private socket: net.Socket
  private timeoutMs: number

  constructor(socket: net.Socket, timeoutMs: number) {
    this.socket = socket
    this.timeoutMs = timeoutMs
    socket.setEncoding('utf8')
    socket.on('data', this.onData)
    socket.on('error', this.onError)
    socket.on('close', this.onClose)
  }

  private onData = (chunk: string | Buffer) => {
    this.buffer += chunk
    if (this.buffer.length > 100_000) this.failure ??= new Error('Jawaban server terlalu panjang.')
    this.wake?.()
  }
  private onError = () => {
    this.failure ??= new Error('Koneksi ke server email gagal.')
    this.wake?.()
  }
  private onClose = () => {
    this.failure ??= new Error('Server email memutus koneksi.')
    this.wake?.()
  }

  async reply(): Promise<{ code: number; text: string }> {
    const deadline = Date.now() + this.timeoutMs
    for (;;) {
      const match = this.buffer.match(/^(?:\d{3}-[^\n]*\n)*(\d{3})(?: [^\n]*)?\r?\n/)
      if (match) {
        this.buffer = this.buffer.slice(match[0].length)
        return { code: Number(match[1]), text: match[0] }
      }
      if (this.failure) throw this.failure
      const left = deadline - Date.now()
      if (left <= 0) throw new Error('Server email tidak menjawab.')
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, left)
        this.wake = () => {
          clearTimeout(timer)
          resolve()
        }
      })
      this.wake = null
    }
  }

  // The error names the step only: a server may echo what it was sent.
  async expect(step: string, ...codes: number[]): Promise<string> {
    const { code, text } = await this.reply()
    if (!codes.includes(code)) throw new Error(`Server email menolak ${step} (${code}).`)
    return text
  }

  async command(line: string, step: string, ...codes: number[]): Promise<string> {
    this.socket.write(`${line}\r\n`)
    return this.expect(step, ...codes)
  }

  write(data: string) {
    this.socket.write(data)
  }

  // Anything sent in clear after STARTTLS could come from an attacker.
  detach(): net.Socket {
    if (this.buffer !== '') throw new Error('Jawaban STARTTLS tidak valid.')
    this.socket.off('data', this.onData).off('error', this.onError).off('close', this.onClose)
    return this.socket
  }

  close() {
    this.socket.destroy()
  }
}

// Connects, encrypts and logs in. Closes the connection when any step fails.
async function openSession(config: SmtpConfig, connectors: Connectors): Promise<Connection> {
  const timeoutMs = connectors.timeoutMs ?? 30_000
  const target = { host: config.host, port: config.port }
  const connectTls = connectors.connectTls ?? ((o) => tls.connect({ ...o, servername: config.host }))
  const connectPlain = connectors.connectPlain ?? ((o) => net.connect(o))
  let connection = new Connection(config.implicitTls ? connectTls(target) : connectPlain(target), timeoutMs)

  try {
    await connection.expect('koneksi', 220)
    let features = await connection.command('EHLO portal', 'EHLO', 250)
    if (!config.implicitTls) {
      if (!/^250[ -]STARTTLS\s*$/im.test(features)) throw new Error('Server email tidak mendukung TLS.')
      await connection.command('STARTTLS', 'STARTTLS', 220)
      const socket = connection.detach()
      connection = new Connection(tls.connect({ socket, servername: config.host }), timeoutMs)
      features = await connection.command('EHLO portal', 'EHLO', 250)
    }
    const credentials = Buffer.from(`\u0000${config.user}\u0000${config.password}`).toString('base64')
    if (/^250[ -]AUTH[ =].*\bPLAIN\b/im.test(features)) {
      await connection.command(`AUTH PLAIN ${credentials}`, 'login', 235)
    } else {
      await connection.command('AUTH LOGIN', 'login', 334)
      await connection.command(Buffer.from(config.user).toString('base64'), 'login', 334)
      await connection.command(Buffer.from(config.password).toString('base64'), 'login', 235)
    }
    return connection
  } catch (error) {
    connection.close()
    throw new SmtpError(error instanceof Error ? error.message : 'Server email tidak bisa dihubungi.', false)
  }
}

export async function checkLogin(config: SmtpConfig, connectors: Connectors = {}): Promise<void> {
  const connection = await openSession(config, connectors)
  connection.write('QUIT\r\n')
  connection.close()
}

export async function sendMail(config: SmtpConfig, mail: Mail, connectors: Connectors = {}): Promise<void> {
  const connection = await openSession(config, connectors)
  let bodySent = false
  try {
    await connection.command(`MAIL FROM:<${mail.from}>`, 'alamat pengirim', 250)
    for (const address of mail.to) await connection.command(`RCPT TO:<${address}>`, 'salah satu penerima', 250, 251)
    await connection.command('DATA', 'isi email', 354)
    const mime = buildMime(mail, randomUUID(), new Date()).replace(/^\./gm, '..')
    bodySent = true
    connection.write(`${mime}${mime.endsWith('\r\n') ? '' : '\r\n'}.\r\n`)
    const { code } = await connection.reply()
    bodySent = false
    if (code !== 250) throw new Error(`Server email menolak isi email (${code}).`)
    connection.write('QUIT\r\n')
  } catch (error) {
    throw new SmtpError(error instanceof Error ? error.message : 'Email gagal dikirim.', bodySent)
  } finally {
    connection.close()
  }
}
