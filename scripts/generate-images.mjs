/**
 * Pipeline de imágenes de ARUMA CLUB.
 *
 * Lee los masters del cliente desde `assets-source/` y genera en `public/images/`
 * los derivados responsive optimizados (AVIF + WebP) que consume la web.
 *
 * Los masters NO se publican: pesan decenas de MB y nunca deben llegar al
 * navegador. Se sirve el encuadre horizontal en escritorio y el vertical en
 * móvil, con los ajustes de encuadre declarados en `CROPS` — ahí queda escrito
 * el porqué de cada uno.
 *
 * Uso: npm run images
 */
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = resolve(root, 'assets-source')
const OUT = resolve(root, 'public/images')

/** Calidades por formato. AVIF pesa ~35% menos que WebP a igual percepción. */
const AVIF = { quality: 52, effort: 5, chromaSubsampling: '4:2:0' }
const WEBP = { quality: 78, effort: 5 }

/**
 * Cada entrega del cliente con sus anchos de presentación.
 *
 * Cuando lleguen las fotografías que hoy son marcadores de posición
 * (`kind: 'placeholder'` en `src/data/media.ts`), basta con dejar el master en
 * `assets-source/`, añadir una línea aquí y cambiar esa entrada del catálogo.
 */
/**
 * Recortes de encuadre.
 *
 * `heroMobile`: el máster trae un 12% de techo vacío por arriba. En un móvil
 * la foto encaja exactamente en altura, así que no hay recorte vertical que
 * `object-position` pueda aprovechar: la composición vertical la decide el
 * archivo. Se corta en origen para subir al sujeto al tercio superior y ganar
 * franja oscura abajo, que es donde se apoya el texto.
 */
const CROPS = {
  heroMobile: { left: 0, top: 283, width: 1304, height: 2075 },

  /**
   * `cocktailPour`: llega en 3:2 y la sección de coctelería está compuesta con
   * una pieza alta. Se recorta a 1:1 centrando la copa, que conserva el gesto
   * vertical del servido y da más resolución que un 4:5.
   */
  cocktailPour: { left: 293, top: 0, width: 1024, height: 1024 },

  /**
   * `plaque`: llega en 4:5 con mucho muro por arriba y por abajo. El hueco al
   * que va es el cuadrado que se solapa en la sección de experiencia, así que
   * se recorta a 1:1 centrando la placa.
   */
  plaque: { left: 0, top: 139, width: 1122, height: 1122 },
}

const JOBS = [
  // El máster mide 1920px de ancho: pedir más solo generaría un archivo que
  // el `srcset` anunciaría como mayor de lo que es.
  { name: 'hero-desktop', from: 'hero-desktop.png', widths: [1024, 1280, 1600, 1920] },
  {
    name: 'hero-mobile',
    from: 'hero-mobile.png',
    crop: CROPS.heroMobile,
    widths: [480, 640, 828, 1080, 1290],
  },

  // Bodegones de marca. Todos vienen en 5:4 y se sirven con esa proporción:
  // recortarlos a 16:9 o a 4:5 partía el objeto que da sentido al plano.
  { name: 'vip-card', from: 'vip-card.png', widths: [480, 720, 1080] },
  { name: 'bar-detail', from: 'bar-detail.png', widths: [480, 720, 1080] },
  { name: 'vip-table', from: 'vip-table.png', widths: [640, 960, 1400] },
  { name: 'bottle-service', from: 'bottle-service.png', widths: [640, 960, 1400] },

  // Fotografía de sección.
  {
    name: 'cocktail-pour',
    from: 'cocktail-pour.png',
    crop: CROPS.cocktailPour,
    widths: [480, 720, 1024],
  },
  { name: 'guests-bar', from: 'guests-bar.png', widths: [640, 960, 1440] },
  { name: 'entrance', from: 'entrance.png', widths: [640, 960, 1440] },
  { name: 'dancing', from: 'dancing.png', widths: [480, 720, 1080] },
  { name: 'room', from: 'room.png', widths: [640, 960, 1440] },
  { name: 'guests-toast', from: 'guests-toast.png', widths: [480, 720, 1080] },
  { name: 'guests-bottle', from: 'guests-bottle.png', widths: [480, 720, 1080] },
  { name: 'guest-portrait', from: 'guest-portrait.png', widths: [480, 720, 1080] },
  { name: 'plaque', from: 'plaque.png', crop: CROPS.plaque, widths: [320, 480, 720] },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`

async function emit(pipeline, name, width) {
  const base = resolve(OUT, `${name}-${width}`)
  const resized = () => pipeline.clone().resize({ width, withoutEnlargement: true })

  const [avif, webp] = await Promise.all([
    resized().avif(AVIF).toFile(`${base}.avif`),
    resized().webp(WEBP).toFile(`${base}.webp`),
  ])

  return { width, avif: avif.size, webp: webp.size, height: webp.height }
}

async function run() {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  for (const job of JOBS) {
    const input = sharp(resolve(SOURCE, job.from), { limitInputPixels: false }).flatten({
      background: '#000000',
    })

    const pipeline = job.crop ? input.extract(job.crop) : input

    const results = []
    for (const width of job.widths) {
      results.push(await emit(pipeline, job.name, width))
    }

    const largest = results.at(-1)
    console.log(
      `${job.name.padEnd(14)} ${String(largest.width).padStart(4)}x${String(largest.height).padEnd(4)}  ` +
        results.map((r) => `${r.width}w ${kb(r.avif)}/${kb(r.webp)}`).join('  ·  '),
    )
  }

  // Logo oficial: se usa como máscara CSS, por eso conserva canal alfa y
  // proporción exacta. Nunca se recorta ni se reencuadra.
  const logo = sharp(resolve(SOURCE, 'logo-aruma.png'))
  const logoMeta = await logo.metadata()
  await logo
    .clone()
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(resolve(OUT, 'logo-aruma.webp'))
  await logo
    .clone()
    .resize({ width: 1280, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(resolve(OUT, 'logo-aruma.png'))
  console.log(`logo           ${logoMeta.width}x${logoMeta.height} -> 1280w (webp + png con alfa)`)

  // Open Graph: el hero horizontal encajado a 1200x630.
  await sharp(resolve(SOURCE, 'hero-desktop.png'), { limitInputPixels: false })
    .flatten({ background: '#000000' })
    .resize({ width: 1200, height: 630, fit: 'cover' })
    .modulate({ brightness: 0.9 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(resolve(root, 'public/og-image.jpg'))

  // Isotipo: la "A" del wordmark oficial, recortada a su caja. El wordmark
  // completo es 8:1 y dentro de un círculo resultaría ilegible.
  const markMeta = await sharp(
    await sharp(resolve(SOURCE, 'logo-aruma.png'))
      .extract({ left: 0, top: 0, width: 250, height: logoMeta.height })
      .trim()
      .toBuffer(),
  )
    .resize({ width: 256 })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(resolve(OUT, 'logo-mark.webp'))
  console.log(`isotipo        ${markMeta.width}x${markMeta.height} (webp con alfa)`)

  // Favicons: la "A" del wordmark oficial, centrada sobre negro.
  const glyph = await sharp(resolve(SOURCE, 'logo-aruma.png'))
    .extract({ left: 0, top: 0, width: 250, height: logoMeta.height })
    .trim()
    .toBuffer()

  for (const size of [32, 180, 192, 512]) {
    const inner = Math.round(size * 0.56)
    const mark = await sharp(glyph).resize({ height: inner, fit: 'inside' }).toBuffer()

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: size === 32 ? '#000000' : '#050505',
      },
    })
      .composite([{ input: mark, gravity: 'center' }])
      .png()
      .toFile(resolve(root, 'public', size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`))
  }
  console.log('favicons + og-image generados')

  const files = await readdir(OUT)
  const total = (
    await Promise.all(files.map(async (f) => (await stat(resolve(OUT, f))).size))
  ).reduce((a, b) => a + b, 0)
  console.log(`\n${files.length} archivos · ${kb(total)} en public/images`)
}

await run()
