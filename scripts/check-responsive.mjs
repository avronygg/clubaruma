/**
 * Guardián de anchos mínimos de rejilla.
 *
 * ── Qué caza ───────────────────────────────────────────────────────────────
 * Una rejilla de doce columnas con separación horizontal impone un ancho
 * mínimo aunque todas sus columnas puedan encogerse a cero, porque los huecos
 * no se encogen: `grid-cols-12 gap-x-8` son once huecos de 32 px, es decir
 * 352 px de suelo. En una ventana de 320 px con 20 px de margen a cada lado
 * solo hay 280 px de sitio, así que la página se salía por la derecha y el
 * contenido quedaba cortado.
 *
 * Es un fallo traicionero: no se ve en escritorio, no se ve en el móvil de
 * 390 px que todo el mundo prueba, y el `overflow-x: clip` del body esconde la
 * barra de scroll, así que tampoco salta a la vista. Aparece solo al arrastrar
 * el modo responsive de Chrome por debajo de 392 px.
 *
 * ── Cómo lo comprueba ──────────────────────────────────────────────────────
 * Sin navegador y sin dependencias: lee las clases de Tailwind y hace la
 * cuenta. Solo mira las separaciones que ya están activas en móvil, que son
 * las que no llevan prefijo de breakpoint. `lg:gap-x-8` no le interesa, porque
 * a partir de 1024 px sobra sitio.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/** El móvil más estrecho que se soporta. Por debajo no hay teléfonos reales. */
const VENTANA_MINIMA = 320
/** `--spacing-gutter` en su valor mínimo, a cada lado. Ver `styles/globals.css`. */
const MARGEN = 20
const DISPONIBLE = VENTANA_MINIMA - MARGEN * 2

/** Un peldaño de la escala de Tailwind son 0,25rem. */
const paso = (n) => n * 4

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n)
    return statSync(ruta).isDirectory() ? archivos(ruta) : ruta.endsWith('.tsx') ? [ruta] : []
  })
}

const fallos = []

for (const ruta of archivos('src')) {
  const contenido = readFileSync(ruta, 'utf8')

  for (const m of contenido.matchAll(/className="([^"]+)"/g)) {
    const clases = m[1].split(/\s+/)

    // Solo las rejillas activas desde móvil: con prefijo, el problema no existe.
    const cols = clases.find((c) => /^grid-cols-\d+$/.test(c))
    if (!cols) continue

    const columnas = Number(cols.split('-').at(-1))
    const hueco = clases.find((c) => /^gap(-x)?-\d+$/.test(c))
    if (!hueco) continue

    const minimo = (columnas - 1) * paso(Number(hueco.split('-').at(-1)))
    if (minimo <= DISPONIBLE) continue

    const linea = contenido.slice(0, m.index).split('\n').length
    fallos.push(
      `${ruta}:${linea}\n` +
        `  «${cols} ${hueco}» impone ${minimo}px de ancho mínimo solo en huecos, ` +
        `y a ${VENTANA_MINIMA}px de ventana solo hay ${DISPONIBLE}px.\n` +
        `  Si las columnas no se reparten hasta un breakpoint, pon la separación ` +
        `ahí: «gap-x-0 lg:${hueco}».`,
    )
  }
}

if (fallos.length) {
  console.error(`\n✗ ${fallos.length} rejilla(s) desbordan a ${VENTANA_MINIMA}px:\n`)
  console.error(fallos.join('\n\n'))
  process.exit(1)
}

console.log(`✓ ninguna rejilla desborda a ${VENTANA_MINIMA}px`)
