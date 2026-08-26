/**
 * Copia únicamente los subsets latinos de las fuentes variables desde node_modules
 * hacia public/fonts, para poder auto-hospedarlas y precargarlas sin depender de un CDN.
 *
 * Uso: npm run sync:fonts
 */
import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'public/fonts')

const FILES = [
  '@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
  '@fontsource-variable/inter-tight/files/inter-tight-latin-ext-wght-normal.woff2',
  '@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2',
  '@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-ext-wght-normal.woff2',
  '@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-italic.woff2',
  '@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-ext-wght-italic.woff2',
]

await mkdir(out, { recursive: true })

for (const file of FILES) {
  const from = resolve(root, 'node_modules', file)
  const to = resolve(out, file.split('/').pop())
  await copyFile(from, to)
  console.log(`✓ ${to.replace(root, '.')}`)
}
