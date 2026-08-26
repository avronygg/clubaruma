import { useScroll, useTransform, m } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'

import { Image } from '@/components/ui/Image'
import { Placeholder } from '@/components/ui/Placeholder'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { imageSettle, mediaEnter, VIEWPORT_ONCE, type MediaEnter } from '@/lib/motion'
import { isImage, type Media } from '@/types'

/**
 * Recorrido vertical de la imagen dentro de su marco, en porcentaje de la
 * altura. Se mantiene muy corto: por encima de esto deja de leerse como
 * profundidad y empieza a leerse como efecto.
 */
const PARALLAX = 3.5

type FigureProps = {
  media: Media
  /** Ancho de presentación por breakpoint. */
  sizes: string
  className?: string
  priority?: boolean
  delay?: number
  /** Animar al asomar en el viewport. */
  reveal?: boolean
  /** Lado por el que entra. Alterna a lo largo de la página. */
  from?: MediaEnter
  /** Realce al pasar el puntero. Solo en piezas de contenido. */
  hover?: boolean
  /** Deriva vertical al hacer scroll. Se apaga en piezas pequeñas. */
  parallax?: boolean
  caption?: string
  /** Fuerza una proporción distinta a la intrínseca del archivo. */
  ratio?: number
}

/**
 * Marco de imagen del sistema (ImageFrame).
 *
 * Reserva la caja por proporción antes de descargar nada, acepta indistintamente
 * fotografía real o hueco pendiente, y encapsula entrada y realce. Ninguna
 * sección escribe `<img>` directamente.
 *
 * ── Entrada ────────────────────────────────────────────────────────────────
 * Cada pieza llega desde el lado en el que se apoya en la retícula y asienta
 * una contra-escala mientras lo hace. Al bajar la página el contenido parece
 * plegarse hacia su sitio en vez de aparecer de golpe, y como las columnas
 * alternan, la lectura va rebotando de un lado a otro.
 *
 * ── Al pasar el puntero ────────────────────────────────────────────────────
 * Tres capas que se mueven juntas durante casi un segundo:
 *
 *   · Por detrás se enciende un halo rojo. El núcleo queda tapado por la propia
 *     foto, así que solo se ve la luz escapando por los bordes.
 *   · El marco se adelanta un punto y engorda su sombra.
 *   · La foto sube de brillo y saturación desde un reposo ligeramente apagado,
 *     con una escala muy corta por encima.
 *
 * El zoom seco de antes desaparece: el realce es de luz, no de tamaño.
 *
 * Todo se desactiva con `prefers-reduced-motion`.
 */
export function Figure({
  media,
  sizes,
  className,
  priority = false,
  delay = 0,
  reveal = true,
  from = 'up',
  hover = false,
  parallax = false,
  caption,
  ratio,
}: FigureProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${PARALLAX}%`, `${PARALLAX}%`])

  const derivable = parallax && !reducedMotion && isImage(media)

  const intrinsicRatio = isImage(media) ? media.width / media.height : media.ratio
  const style: CSSProperties = { aspectRatio: ratio ?? intrinsicRatio }

  const content = isImage(media) ? (
    <Image
      asset={media}
      sizes={sizes}
      priority={priority}
      className={cn(
        'figure-media',
        // Al 110% mientras deriva, para que el desplazamiento no descubra
        // los bordes del marco.
        derivable && 'scale-110',
        hover &&
          'brightness-[0.9] saturate-[0.92] group-hover:brightness-[1.04] group-hover:saturate-[1.06]',
        hover && (derivable ? 'group-hover:scale-[1.13]' : 'group-hover:scale-[1.03]'),
      )}
    />
  ) : (
    <Placeholder asset={media} />
  )

  const media_ = derivable ? (
    <m.div style={{ y }} className="h-full w-full">
      {content}
    </m.div>
  ) : (
    content
  )

  const frame = (
    <div className="relative h-full w-full">
      {hover ? (
        <span
          aria-hidden="true"
          className="pointer-events-none figure-glow group-hover:scale-100 group-hover:opacity-40"
        />
      ) : null}

      <div
        ref={frameRef}
        className={cn(
          'relative h-full w-full overflow-hidden bg-black-soft figure-lift',
          hover &&
            'group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_64px_-30px_rgb(0_0_0/0.9)]',
        )}
      >
        {reveal ? (
          <m.div className="h-full w-full" variants={imageSettle(delay)}>
            {media_}
          </m.div>
        ) : (
          media_
        )}
      </div>
    </div>
  )

  const box = (
    <div className="relative w-full" style={style}>
      {frame}
    </div>
  )

  const body: ReactNode = caption ? (
    <>
      {box}
      <figcaption
        className={cn(
          'mt-3 text-label text-muted-strong uppercase',
          'transition-colors duration-(--duration-ui) ease-expensive group-hover:text-white/80',
        )}
      >
        {caption}
      </figcaption>
    </>
  ) : (
    box
  )

  const shell = cn('group relative', caption && 'm-0', className)

  // Sin revelado no hay nada que orquestar: un elemento normal evita montar
  // un observador de viewport por cada hueco.
  if (!reveal) {
    return caption ? <figure className={shell}>{body}</figure> : <div className={shell}>{body}</div>
  }

  const orquesta = {
    variants: mediaEnter(from, delay),
    initial: 'hidden',
    whileInView: 'visible',
    viewport: VIEWPORT_ONCE,
    className: shell,
  } as const

  return caption ? <m.figure {...orquesta}>{body}</m.figure> : <m.div {...orquesta}>{body}</m.div>
}
