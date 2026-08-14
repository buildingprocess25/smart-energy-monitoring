import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const possibleSrcDirs = [
  path.resolve(__dirname, '../../sparta-energy/public/assets'),
  'd:/Coding/sparta-energy/public/assets',
]

const destDir = path.resolve(__dirname, '../public/assets')

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

const srcDir = possibleSrcDirs.find((dir) => fs.existsSync(dir))

if (srcDir) {
  const files = fs.readdirSync(srcDir)
  for (const file of files) {
    const srcFile = path.join(srcDir, file)
    const destFile = path.join(destDir, file)
    fs.copyFileSync(srcFile, destFile)
    console.log(`[assets] Copied ${file} -> public/assets/${file}`)
  }
} else {
  console.warn('[assets] Source directory for sparta-energy assets not found.')
}
