import { buildSrcSet, fallbackSrc } from '@/lib/images'
import { cn } from '@/lib/cn'
import type { ImageAsset } from '@/types'

type ImageProps = {
  asset: ImageAsset
  /** Ancho de presentación por breakpoint. Obligatorio: sin `sizes` no hay responsive real. */
  sizes: string
  /** Solo para el LCP del hero: desactiva lazy y sube la prioridad de red. */
  priority?: boolean
  className?: string
  alt?: string
}

/**
 * Imagen responsive.
 *
 * Sirve AVIF y deja WebP como respaldo. `width`/`height` van siempre en el
 * `<img>` para que el navegador reserve la caja antes de descargar: cero CLS.
 */
export function Image({ asset, sizes, priority = false, className, alt }: ImageProps) {
  return (
    <picture className="block h-full w-full">
      <source type="image/avif" srcSet={buildSrcSet(asset, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(asset, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(asset)}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  )
}
