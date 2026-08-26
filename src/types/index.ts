/* ==========================================================================
   Tipos de dominio de ARUMA CLUB
   ========================================================================== */

/* --- Navegación ----------------------------------------------------------- */

export type NavItem = {
  readonly id: string
  readonly label: string
  /** Ancla dentro de la home (`#experiencia`) o ruta futura (`/vip`). */
  readonly href: string
}

export type SocialLink = {
  readonly id: string
  readonly label: string
  readonly href: string
  readonly handle: string
}

/* --- Media ---------------------------------------------------------------- */

/**
 * Imagen real ya procesada por `npm run images`.
 * `width`/`height` son las dimensiones intrínsecas del derivado más grande y
 * se usan para reservar espacio y evitar layout shift.
 */
export type ImageAsset = {
  readonly kind: 'image'
  readonly name: string
  readonly widths: readonly number[]
  readonly width: number
  readonly height: number
  readonly alt: string
}

/**
 * Hueco para fotografía que el cliente todavía no ha entregado.
 * Se dibuja como marco de marca con etiqueta visible: nunca se disimula.
 * Sustituirlo consiste en cambiar esta entrada por un `ImageAsset`.
 */
export type PlaceholderAsset = {
  readonly kind: 'placeholder'
  /** Qué fotografía falta. Se muestra en pantalla. */
  readonly label: string
  /** Proporción ancho/alto (p. ej. 0.8 para 4:5). */
  readonly ratio: number
  /** Indicación de dirección de arte para el fotógrafo. */
  readonly brief?: string
}

export type Media = ImageAsset | PlaceholderAsset

export function isImage(media: Media): media is ImageAsset {
  return media.kind === 'image'
}

/* --- Contenido ------------------------------------------------------------ */

export type GalleryCategory = 'ambiente' | 'coctelería' | 'gente' | 'detalle'

/**
 * Preparado para crecer hacia lightbox, carrusel, filtros o CMS:
 * la galería nunca lee JSX, siempre este contrato.
 */
export type GalleryItem = {
  readonly id: string
  readonly media: Media
  /** Reservado para el filtrado futuro; no se muestra en pantalla. */
  readonly category: GalleryCategory
  /** Pie de foto visible. Si falta, se usa la categoría. */
  readonly caption?: string
  /** Peso en la retícula editorial (1 = celda normal, 2 = destacada). */
  readonly span: 1 | 2
}

export type SectionContent = {
  readonly id: string
  readonly index: string
  readonly eyebrow: string
  readonly title: readonly [lead: string, accent: string]
  readonly body: string
  readonly cta?: {
    readonly label: string
    readonly href: string
  }
}

export type OpeningHours = {
  readonly days: string
  readonly hours: string
}
