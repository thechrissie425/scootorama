/* global process, console, document */
/**
 * Rasterizes scripts/seed/art/svg/*.svg to scripts/seed/images/*.jpg using
 * Playwright's Chromium (so SVG <text> renders with the brand's Bungee font).
 *
 *   python3 scripts/seed/art/scenes.py && node scripts/seed/art/render.mjs
 *
 * Set CHROMIUM_PATH to use a specific Chromium binary.
 */
import { chromium } from 'playwright'
import { readdirSync, readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const svgDir = join(here, 'svg')
const outDir = join(here, '..', 'images')
const font = readFileSync(
  join(here, '..', '..', '..', 'public', 'fonts', 'Bungee-Regular.woff2')
).toString('base64')

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
)
const page = await browser.newPage()

for (const file of readdirSync(svgDir).filter(f => f.endsWith('.svg'))) {
  const svg = readFileSync(join(svgDir, file), 'utf8')
  const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/)
  await page.setViewportSize({ width: Number(w), height: Number(h) })
  await page.setContent(
    `<style>@font-face{font-family:Bungee;src:url(data:font/woff2;base64,${font})}html,body{margin:0;background:transparent}</style>${svg}`
  )
  await page.evaluate(() => document.fonts.ready)
  // lockup-* art is rendered as transparent PNG (used over colored nav bars)
  const transparent = file.startsWith('lockup-')
  const out = join(outDir, file.replace('.svg', transparent ? '.png' : '.jpg'))
  await page.screenshot(
    transparent
      ? { path: out, type: 'png', omitBackground: true }
      : { path: out, type: 'jpeg', quality: 88 }
  )
  console.log('rendered', out)
}

await browser.close()
