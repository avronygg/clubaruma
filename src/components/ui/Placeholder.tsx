import { cn } from '@/lib/cn'
import type { PlaceholderAsset } from '@/types'

type Ratio = readonly [label: string, value: number]

/** Proporciones habituales de encargo fotográfico. */
const COMMON_RATIOS: readonly Ratio[] = [
  ['1:1', 1],
  ['4:5', 4 / 5],
  ['3:4', 3 / 4],
  ['2:3', 2 / 3],
  ['3:2', 3 / 2],
  ['4:3', 4 / 3],
  ['16:9', 16 / 9],
  ['21:9', 21 / 9],
]

/** Traduce la proporción a la notación que entiende un fotógrafo. */
function formatRatio(ratio: number): string {
  let closest: Ratio = ['1:1', 1]
  for (const candidate of COMMON_RATIOS) {
    if (Math.abs(candidate[1] - ratio) < Math.abs(closest[1] - ratio)) closest = candidate
  }
  return closest[0]
}

type PlaceholderProps = {
  asset: PlaceholderAsset
  className?: string
}

/**
 * Hueco de fotografía pendiente.
 *
 * Se declara como tal en pantalla —nunca se disfraza reutilizando otra foto—
 * pero está compuesto con el mismo lenguaje que el resto: negro, filete,
 * versalitas y un único acento rojo. La maqueta se puede enseñar al cliente sin
 * que parezca rota, y el marco lleva dentro el briefing y la proporción que
 * necesita quien haga la producción.
 *
 * El detalle se adapta al tamaño del marco con consultas de contenedor: en
 * piezas pequeñas solo queda la etiqueta.
 */
export function Placeholder({ asset, className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`${asset.label} — pendiente de entrega`}
      className={cn(
        '@container relative flex h-full w-full flex-col items-center justify-center gap-3',
        'overflow-hidden border border-white/14 px-5 py-8 text-center',
        'bg-[linear-gradient(to_bottom,#121212,#0a0a0a)]',
        className,
      )}
    >
      {/* Trama diagonal finísima: es el código visual universal de «aquí va una
          imagen». Puro CSS, sin assets ni datos incrustados. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgb(245_245_245/0.032)_0_1px,transparent_1px_9px)]"
      />

      {/* Halo rojo muy contenido: sugiere la luz del local sin simular la foto. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_118%,rgb(163_15_26/0.26),transparent_64%)]"
      />

      {/* Marcas de esquina: lenguaje de hoja de contactos. */}
      {[
        'top-3 left-3 border-t border-l @[18rem]:top-4 @[18rem]:left-4',
        'top-3 right-3 border-t border-r @[18rem]:top-4 @[18rem]:right-4',
        'bottom-3 left-3 border-b border-l @[18rem]:bottom-4 @[18rem]:left-4',
        'right-3 bottom-3 border-r border-b @[18rem]:right-4 @[18rem]:bottom-4',
      ].map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute size-2 border-white/30 @[18rem]:size-3',
            position,
          )}
        />
      ))}

      <span aria-hidden="true" className="relative size-1.5 rounded-full bg-red-bright" />

      <span className="relative text-label font-medium tracking-[0.26em] text-white/85 uppercase">
        {asset.label}
      </span>

      {asset.brief ? (
        <span className="relative hidden max-w-[30ch] text-[0.6875rem] leading-relaxed text-muted @[15rem]:block">
          {asset.brief}
        </span>
      ) : null}

      <span className="relative hidden text-label text-white/55 uppercase @[15rem]:block">
        {formatRatio(asset.ratio)}
      </span>
    </div>
  )
}
