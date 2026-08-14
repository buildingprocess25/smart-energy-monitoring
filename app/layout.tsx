import fs from 'node:fs'
import path from 'node:path'
import { Inter, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function ensureAssets() {
  try {
    const destDir = path.join(process.cwd(), 'public/assets')
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    const possibleSrcDirs = [
      path.resolve(process.cwd(), '../sparta-energy/public/assets'),
      'd:/Coding/sparta-energy/public/assets',
    ]
    const srcDir = possibleSrcDirs.find((dir) => fs.existsSync(dir))
    if (srcDir) {
      const files = fs.readdirSync(srcDir)
      for (const file of files) {
        const destFile = path.join(destDir, file)
        if (!fs.existsSync(destFile)) {
          fs.copyFileSync(path.join(srcDir, file), destFile)
        }
      }
    }
  } catch {
    // ignore
  }
}

ensureAssets()

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: 'Smart Energy Monitoring',
  description: 'Smart Energy & Utility Monitoring System — Alfamart Store Telemetry Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
