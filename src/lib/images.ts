import type { ImageAsset } from '@/types'

/**
 * Convención de nombres del pipeline (`scripts/generate-images.mjs`):
 *   public/images/{nombre}-{ancho}.{avif|webp}
 */
const IMAGE_DIR = '/images'

export function buildSrcSet(asset: ImageAsset, format: 'avif' | 'webp'): string {
  return asset.widths.map((w) => `${IMAGE_DIR}/${asset.name}-${w}.${format} ${w}w`).join(', ')
}

/** Fallback del <img>: ancho intermedio en WebP (soporte universal). */
export function fallbackSrc(asset: ImageAsset): string {
  const index = Math.min(1, asset.widths.length - 1)
  return `${IMAGE_DIR}/${asset.name}-${asset.widths[index]}.webp`
}

/** Recurso que conviene precargar (solo el LCP del hero). */
export function preloadHref(asset: ImageAsset, width: number, format: 'avif' | 'webp'): string {
  return `${IMAGE_DIR}/${asset.name}-${width}.${format}`
}

export function aspectRatio(asset: { width: number; height: number }): number {
  return asset.width / asset.height
}
