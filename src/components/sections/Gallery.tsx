import { Sequence, Step } from '@/components/animations/Sequence'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Figure } from '@/components/ui/Figure'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { galleryItems } from '@/data/gallery'
import { gallerySection } from '@/data/home'
import { cn } from '@/lib/cn'
import { isImage, type GalleryItem } from '@/types'

const TITLE_ID = 'galeria-titulo'

/**
 * Proporción mínima de las celdas anchas. A 5:4 entran los bodegones de marca
 * sin recorte; lo que ya sea más apaisado conserva su proporción nativa.
 */
const WIDE_MIN_RATIO = 5 / 4

function ratioFor(item: GalleryItem): number {
  const intrinsic = isImage(item.media) ? item.media.width / item.media.height : item.media.ratio

  return item.span === 2 ? Math.max(intrinsic, WIDE_MIN_RATIO) : intrinsic
}

function sizesFor(span: GalleryItem['span']): string {
  return span === 2
    ? '(min-width: 1024px) 64vw, (min-width: 768px) 46vw, 92vw'
    : '(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw'
}

/**
 * Galería.
 *
 * La retícula se deriva de `data/gallery.ts`: nada está escrito a mano en el
 * JSX. Alternar `span` 1 y 2 produce filas de 4+8 y 8+4 columnas, que es lo que
 * evita la cuadrícula uniforme de catálogo.
 *
 * El contrato ya soporta lightbox, carrusel, filtros por categoría o CMS sin
 * tocar este componente.
 */
export function Gallery() {
  return (
    <Section id={gallerySection.id} aria-labelledby={TITLE_ID}>
      <Container>
        <Sequence className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Step>
              <Eyebrow index={gallerySection.index}>{gallerySection.eyebrow}</Eyebrow>
            </Step>
            <Step>
              <Heading
                id={TITLE_ID}
                lead={gallerySection.title[0]}
                accent={gallerySection.title[1]}
                className="mt-7"
              />
            </Step>
          </div>

          <Step>
            <p className="text-label text-muted-strong uppercase">{gallerySection.note}</p>
          </Step>
        </Sequence>

        <ul className="mt-14 grid grid-cols-12 gap-x-0 gap-y-10 sm:mt-20 md:gap-x-6 lg:gap-x-8">
          {galleryItems.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                'col-span-12 md:col-span-6',
                item.span === 2 ? 'lg:col-span-8' : 'lg:col-span-4',
              )}
            >
              <Figure
                media={item.media}
                sizes={sizesFor(item.span)}
                ratio={ratioFor(item)}
                caption={item.caption ?? item.category}
                delay={index % 2 === 0 ? 0 : 0.1}
                from={index % 2 === 0 ? 'left' : 'right'}
                hover
                parallax
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
