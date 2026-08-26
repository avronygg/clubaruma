import {
  bottleService,
  galleryRoom,
  guestPortrait,
  guestsBottle,
  guestsToast,
  vipTable,
} from '@/data/media'
import type { GalleryItem } from '@/types'

/**
 * Galería.
 *
 * La retícula se deriva de este array: nada está escrito a mano en el JSX.
 * Alternar `span` 1 y 2 produce filas de 4+8 y 8+4 columnas en escritorio, que
 * es lo que evita la cuadrícula uniforme de catálogo.
 *
 * Criterio de reparto: las piezas apaisadas ocupan las celdas anchas (`span: 2`)
 * y las cuadradas o verticales las estrechas. Si sustituyes un marcador por una
 * foto de otra proporción, revisa que siga cuadrando.
 *
 * El contrato ya soporta lightbox, carrusel, filtros por `category` o CMS sin
 * tocar el componente.
 */
export const galleryItems: readonly GalleryItem[] = [
  { id: 'g-01', media: guestsToast, category: 'gente', caption: 'Invitados', span: 1 },
  { id: 'g-02', media: vipTable, category: 'ambiente', caption: 'Reservados', span: 2 },
  { id: 'g-03', media: galleryRoom, category: 'ambiente', caption: 'Sala', span: 2 },
  { id: 'g-04', media: guestsBottle, category: 'gente', caption: 'Brindis', span: 1 },
  { id: 'g-05', media: guestPortrait, category: 'gente', caption: 'La noche', span: 1 },
  {
    id: 'g-06',
    media: bottleService,
    category: 'detalle',
    caption: 'Servicio de botella',
    span: 2,
  },
] as const
