/**
 * Pipeline de vídeo de ARUMA CLUB.
 *
 * El máster llega a 720x1280, 60 fps y ~7.700 kbps: casi 10 MB por diez
 * segundos, más que el resto de la web entera. Nunca debe servirse tal cual.
 *
 * Genera dos derivados con propósitos distintos:
 *
 *   · `reel-preview`  — sin pista de audio, pequeño y a 30 fps. Es el que se
 *                       reproduce solo en la burbuja flotante, así que pesa lo
 *                       mínimo: se descarga siempre, lo vea o no la persona.
 *   · `reel-full`     — con sonido, a resolución completa. Solo se descarga
 *                       cuando alguien pulsa para ampliarlo.
 *
 * Más un póster, para que la burbuja no muestre un rectángulo negro mientras
 * el vídeo llega.
 *
 * Uso: npm run video
 */
import { mkdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import ffmpeg from 'ffmpeg-static'
import sharp from 'sharp'

const run = promisify(execFile)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = resolve(root, 'assets-source/reel.mp4')
const OUT = resolve(root, 'public/video')

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`

async function pesar(ruta) {
  return (await stat(ruta)).size
}

async function main() {
  await mkdir(OUT, { recursive: true })

  const original = await pesar(SOURCE)

  // Vista previa: sin audio, 240px de ancho. La burbuja mide 80px, así que
  // 240 cubre pantallas de densidad 3x de sobra.
  const preview = resolve(OUT, 'reel-preview.mp4')
  await run(ffmpeg, [
    '-y', '-i', SOURCE,
    '-an',
    // Dimensiones exactas, no calculadas: `scale=240:-2` redondeaba a
    // 240x426 (0.5634) y dejaba de ser 9:16 clavado.
    '-vf', 'scale=252:448,fps=30',
    '-c:v', 'libx264', '-profile:v', 'main', '-crf', '30', '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    // Coloca el índice al principio: empieza a reproducir sin esperar al final.
    '-movflags', '+faststart',
    preview,
  ])

  // Vista ampliada: resolución completa y sonido, pero a 30 fps y con un
  // bitrate sensato. Es un plano hablado, no una secuencia de acción.
  const full = resolve(OUT, 'reel-full.mp4')
  await run(ffmpeg, [
    '-y', '-i', SOURCE,
    '-vf', 'scale=720:1280,fps=30',
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '26', '-preset', 'slow',
    '-c:a', 'aac', '-b:a', '96k',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    full,
  ])

  // Póster: primer fotograma con contenido, no el negro inicial.
  const frame = resolve(OUT, 'reel-poster.png')
  await run(ffmpeg, ['-y', '-ss', '0.6', '-i', SOURCE, '-frames:v', '1', '-vf', 'scale=360:640', frame])
  await sharp(frame).webp({ quality: 78 }).toFile(resolve(OUT, 'reel-poster.webp'))

  const pesos = {
    preview: await pesar(preview),
    full: await pesar(full),
    poster: await pesar(resolve(OUT, 'reel-poster.webp')),
  }

  console.log(`máster          ${mb(original)}`)
  console.log(`reel-preview    ${mb(pesos.preview)}  (sin audio, 240px)`)
  console.log(`reel-full       ${mb(pesos.full)}  (con audio, 720px)`)
  console.log(`reel-poster     ${(pesos.poster / 1024).toFixed(0)} kB`)
  console.log(
    `\nLa burbuja descarga ${mb(pesos.preview)} en lugar de ${mb(original)}: ` +
      `${Math.round((1 - pesos.preview / original) * 100)}% menos.`,
  )
}

await main()
