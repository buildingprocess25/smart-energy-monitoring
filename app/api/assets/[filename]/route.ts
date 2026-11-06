import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

// A bare file name only: no slashes, no "..", so the path cannot leave the assets folder.
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

// Local copy first; the sparta-energy checkout next to this repo is a development fallback.
const ASSET_DIRS = [
  path.join(process.cwd(), 'public/assets'),
  path.resolve(process.cwd(), '../sparta-energy/public/assets'),
]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()]

  if (!SAFE_FILENAME.test(filename) || filename.includes('..') || !contentType) {
    return new NextResponse('Asset not found', { status: 404 })
  }

  for (const dir of ASSET_DIRS) {
    const filePath = path.join(dir, filename)
    if (path.dirname(filePath) !== dir || !fs.existsSync(filePath)) continue

    return new NextResponse(fs.readFileSync(filePath), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  return new NextResponse('Asset not found', { status: 404 })
}
