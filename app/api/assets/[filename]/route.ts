import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  const possiblePaths = [
    path.join(process.cwd(), 'public/assets', filename),
    path.resolve(process.cwd(), '../sparta-energy/public/assets', filename),
    path.join('d:/Coding/sparta-energy/public/assets', filename),
  ]

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath)

      // Ensure local public/assets copy exists
      try {
        const localAssetsDir = path.join(process.cwd(), 'public/assets')
        if (!fs.existsSync(localAssetsDir)) {
          fs.mkdirSync(localAssetsDir, { recursive: true })
        }
        const localDest = path.join(localAssetsDir, filename)
        if (!fs.existsSync(localDest)) {
          fs.writeFileSync(localDest, buffer)
        }
      } catch {
        // ignore error
      }

      const ext = path.extname(filename).toLowerCase()
      const contentType =
        ext === '.png'
          ? 'image/png'
          : ext === '.jpg' || ext === '.jpeg'
          ? 'image/jpeg'
          : ext === '.svg'
          ? 'image/svg+xml'
          : ext === '.ico'
          ? 'image/x-icon'
          : 'application/octet-stream'

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  }

  return new NextResponse('Asset not found', { status: 404 })
}
