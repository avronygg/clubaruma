import { AnimatePresence, m } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'

import { Logo } from '@/components/ui/Logo'
import { reel } from '@/data/home'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'

const PREVIEW = '/video/reel-preview.mp4'
const FULL = '/video/reel-full.mp4'
const POSTER = '/video/reel-poster.webp'
const CAPTIONS = '/video/reel-es.vtt'

/**
 * Lo que se espera antes de cargar el vídeo de la miniatura. Hasta entonces
 * solo se ve el póster: la portada tiene prioridad de red sobre un flotante.
 */
const MOUNT_DELAY = 2500

/**
 * Parte del alto de ventana que hay que dejar atrás para que la miniatura
 * asome en móvil. Ver `pasadoElHero`.
 */
const HERO_THRESHOLD = 0.6

type FloatingReelProps = {
  /** Cerrar el vídeo y abrir el formulario: el reel invita justamente a eso. */
  onJoin: () => void
  /** Se oculta con el diálogo o el menú abiertos: estorbaría por encima. */
  hidden?: boolean
}

/**
 * Reel flotante.
 *
 * Hace de contrapeso al botón de la lista: miniatura vertical abajo a la
 * izquierda, en bucle y sin sonido, con la proporción 9:16 del propio reel —no
 * un círculo, que recortaría el encuadre por el que se grabó—. Al pulsarla se
 * abre en un reproductor con la marca, sonido y controles nativos.
 *
 * Son dos archivos distintos a propósito. El de la miniatura pesa 130 kB y no
 * lleva pista de audio, porque se descarga siempre; el de 1,2 MB con sonido
 * solo se pide cuando alguien decide verlo. Ver `scripts/generate-video.mjs`.
 *
 * ── Se aparta mientras lees ────────────────────────────────────────────────
 * La tarjeta tiene que verse grande, y una tarjeta grande abajo a la izquierda
 * se come el arranque de cada línea de texto. En una pantalla de 360 px son un
 * tercio del renglón, y las dos cosas no caben a la vez.
 *
 * Se resuelve como lo resuelven las cabeceras de las webs móviles: se retira
 * al bajar y vuelve al subir. Quien está leyendo va hacia abajo, así que la
 * tarjeta no le tapa nada; quien vuelve sobre sus pasos o busca algo la
 * encuentra enseguida. No hace falta encogerla ni esconderla del todo.
 */
export function FloatingReel({ onJoin, hidden = false }: FloatingReelProps) {
  const titleId = useId()
  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [pasadoElHero, setPasadoElHero] = useState(false)
  const direccion = useScrollDirection()
  const reducedMotion = usePrefersReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useLockBodyScroll(expanded)

  // Con movimiento reducido no se reproduce nada solo: queda el póster y la
  // persona decide si quiere verlo.
  useEffect(() => {
    if (reducedMotion) return

    const timer = window.setTimeout(() => setLoaded(true), MOUNT_DELAY)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  // En escritorio la miniatura no estorba a nadie y se queda desde el principio.
  // En móvil el hero ocupa la ventana entera, así que a 108 px la tarjeta se
  // montaba sobre el botón «Únete a la lista»: el reel competía con la
  // conversión principal en lugar de alimentarla. Se retira hasta que el hero
  // queda atrás, que es cuando la esquina está libre.
  useEffect(() => {
    const mirar = () => {
      setPasadoElHero(window.scrollY > window.innerHeight * HERO_THRESHOLD)
    }

    mirar()
    window.addEventListener('scroll', mirar, { passive: true })
    window.addEventListener('resize', mirar)

    return () => {
      window.removeEventListener('scroll', mirar)
      window.removeEventListener('resize', mirar)
    }
  }, [])

  useEffect(() => {
    if (!expanded) return

    previousFocus.current = document.activeElement as HTMLElement | null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }

    document.addEventListener('keydown', onKeyDown)
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 260)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
      previousFocus.current?.focus?.()
    }
  }, [expanded])

  return (
    <>
      <div
        className={cn(
          // Esquina opuesta al botón de la lista y bastante mayor que él: aquí
          // hay una cara hablando, y a tamaño de icono no se distingue ni que
          // es una persona ni que está diciendo algo.
          'fixed bottom-16 left-gutter z-90 sm:bottom-6',
          'transition-[opacity,translate] duration-(--duration-reveal) ease-expensive',
          (hidden || expanded) && 'pointer-events-none opacity-0',
          !pasadoElHero && 'max-sm:pointer-events-none max-sm:-translate-x-6 max-sm:opacity-0',
          // Se aparta hacia su esquina en lugar de desvanecerse sin más: el
          // movimiento lateral dice hacia dónde se ha ido y de dónde volverá.
          direccion === 'down' && 'pointer-events-none -translate-x-8 opacity-0',
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={reel.open}
          className={cn(
            'group relative block w-[6.75rem] overflow-hidden rounded-[1.4rem] sm:w-[8.5rem]',
            'aspect-[9/16] border border-white/15 bg-black',
            'shadow-[0_12px_40px_-14px_rgb(0_0_0/0.85)]',
            'transition-[scale,border-color] duration-(--duration-ui) ease-expensive',
            'hover:scale-[1.03] hover:border-white/35',
          )}
        >
          {loaded ? (
            <video
              src={PREVIEW}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              // Decorativo: el contenido con voz está en la versión ampliada,
              // y la etiqueta del botón ya dice qué hace.
              aria-hidden="true"
              className="size-full object-cover"
            />
          ) : (
            <img src={POSTER} alt="" className="size-full object-cover" />
          )}

          {/* Degradado inferior en lugar de un velo completo: el vídeo se ve
              limpio y la señal de reproducción sigue legible. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgb(5_5_5/0.85),transparent)]"
          />

          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-2.5 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center sm:size-10',
              'rounded-full bg-white/15 backdrop-blur-sm',
              'transition-colors duration-(--duration-micro) group-hover:bg-red',
            )}
          >
            <span className="ml-0.5 block size-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {expanded ? (
          <m.div
            className="fixed inset-0 z-110 flex items-center justify-center px-gutter py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: EASE.expensive }}
          >
            <div
              aria-hidden="true"
              onClick={() => setExpanded(false)}
              className="absolute inset-0 bg-black/88 backdrop-blur-md"
            />

            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              transition={{ duration: DURATION.ui + 0.15, ease: EASE.expensive }}
              className={cn(
                'relative flex max-h-full w-full flex-col overflow-hidden glass',
                'rounded-[1.75rem] p-2 focus:outline-none',
                // El ancho sale de la altura libre: así el 9:16 siempre cabe
                // completo. Antes el tope de altura deformaba la caja y el
                // recorte se comía la cabeza del plano.
                'max-w-[min(22rem,calc((100svh-15rem)*0.5625))]',
              )}
            >
              <h2 id={titleId} className="sr-only">
                {reel.title}
              </h2>

              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label={reel.close}
                className="absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white/80 backdrop-blur-sm transition-colors duration-(--duration-micro) hover:bg-black/75 hover:text-white"
              >
                <span aria-hidden="true" className="relative block size-3.5">
                  <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                  <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>

              {/* Controles nativos: pausar, retroceder y ajustar volumen sin que
                  haya que reimplementar —mal— lo que el navegador ya resuelve. */}
              <video
                src={FULL}
                poster={POSTER}
                autoPlay
                controls
                playsInline
                className="aspect-[9/16] w-full rounded-[1.25rem] bg-black object-contain"
              >
                {/* ⚠️ PENDIENTE: `public/video/reel-es.vtt` está sin cues. Un
                    vídeo hablado sin subtítulos no llega a quien no oye, ni a
                    la mayoría que ve vídeo con el sonido apagado. */}
                <track kind="captions" srcLang="es" label="Español" src={CAPTIONS} />
              </video>

              {/* Pie de marca: el reel invita a entrar en la lista, así que la
                  acción vive dentro de la misma pieza y no suelta debajo.
                  Apilado, no en fila: la tarjeta mide 352px y a esa anchura el
                  texto se estrangulaba contra el botón. */}
              <div className="px-4 pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <Logo variant="mark" decorative className="w-3.5 shrink-0 text-red-bright" />
                  <p className="text-label text-muted uppercase">{reel.eyebrow}</p>
                </div>

                <p className="mt-2 text-body leading-snug text-white">{reel.pitch}</p>

                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false)
                    onJoin()
                  }}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-pill bg-red text-nav font-medium tracking-[0.16em] text-white uppercase transition-colors duration-(--duration-micro) hover:bg-red-bright"
                >
                  {reel.cta}
                </button>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
