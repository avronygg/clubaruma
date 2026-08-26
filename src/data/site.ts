import type { OpeningHours, SocialLink } from '@/types'

/**
 * Configuración global de marca y contacto.
 *
 * ⚠️ PENDIENTE DE CLIENTE: los valores marcados con TODO son marcadores de
 * posición. Deben confirmarse antes de publicar. Ver README → «Datos por
 * completar».
 */
export const site = {
  name: 'Aruma Club',
  shortName: 'ARUMA',
  /**
   * Dominio público. Sale del entorno, igual que la sustitución de
   * `%SITE_URL%` en `index.html`, para que el canonical y las etiquetas Open
   * Graph estáticas apunten siempre al mismo sitio.
   *
   * TODO: cuando el dominio definitivo esté activo, basta con cambiar
   * `VITE_SITE_URL` en Vercel. El código no se toca.
   */
  url: (import.meta.env['VITE_SITE_URL'] ?? 'https://arumaclub.cl').replace(/\/$/, ''),
  locale: 'es-CL',
  /** Va en cursiva al pie. Sitúa ciudad y horario en cinco palabras. */
  tagline: 'Ovalle, después de medianoche.',
  title: 'Aruma Club · Club nocturno en Ovalle · Lista VIP',
  description:
    'Aruma Club abre en septiembre de 2026 en el Ovalle Casino & Resort, para mayores de 25. Coctelería de autor y DJ en vivo. Entra a la lista VIP.',
} as const

/**
 * Estado de prelanzamiento.
 *
 * El club todavía no ha abierto: toda la web está construida para generar
 * expectativa y captar lista de espera. Cuando abra, basta con poner
 * `open: true` y revisar los textos de `data/home.ts` marcados como prelanzamiento.
 */
export const launch = {
  open: false,
  /** TODO: confirmar mes/fecha exacta antes de publicar. */
  period: 'Septiembre 2026',
  shortLabel: 'Apertura',
  /** Texto del distintivo flotante de la cabecera. */
  badge: 'Muy pronto',
  scarcity: 'Cupos limitados',
} as const

/**
 * Consulta que se manda a Google Maps. De aquí salen tanto el mapa incrustado
 * como el enlace de «cómo llegar», así que la dirección se escribe una sola vez
 * y las dos cosas no pueden acabar apuntando a sitios distintos.
 */
const MAPS_QUERY =
  'Ovalle Casino & Resort, Av. Manuel Peñafiel Olivares 2711, Ovalle, Coquimbo, Chile'

export const contact = {
  /**
   * El club está dentro del casino. Es el dato que más ubica a un local de
   * Ovalle, así que aparece en el titular de «cómo llegar», en el pie y en los
   * metadatos, no solo en la dirección postal.
   *
   * El nombre y el número salen de la ficha del recinto en Google Maps, que es
   * como lo va a buscar cualquiera: «Ovalle Casino & Resort», no «Casino
   * Ovalle Resort».
   */
  venue: 'Ovalle Casino & Resort',
  address: 'Av. Manuel Peñafiel Olivares 2711',
  shortCity: 'Ovalle',
  city: 'Ovalle, Región de Coquimbo',
  /** Mapa incrustado. `output=embed` no necesita clave de API. */
  mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=15&hl=es&output=embed`,
  /** Abre la navegación en la app de mapas del dispositivo. */
  mapsDirections: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`,
  /** TODO: confirmar número. Formato E.164 para el enlace de WhatsApp. */
  whatsapp: '+56900000000',
  whatsappLabel: '+56 9 0000 0000',
  /** TODO: confirmar correo comercial. */
  email: 'hola@arumaclub.cl',
} as const

/** Horario previsto: todavía no está en funcionamiento. */
export const openingHours: readonly OpeningHours[] = [
  { days: 'Jueves', hours: '23:00 — 04:00' },
  { days: 'Viernes — Sábado', hours: '23:00 — 05:00' },
] as const

export const socialLinks: readonly SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    /** TODO: confirmar handle oficial. */
    href: 'https://instagram.com/arumaclub',
    handle: '@arumaclub',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    /** TODO: confirmar página oficial. */
    href: 'https://facebook.com/arumaclub',
    handle: '/arumaclub',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
    handle: contact.whatsappLabel,
  },
] as const

/**
 * Interruptores de experiencia.
 * El preloader solo se muestra una vez por sesión y se cierra en cuanto la
 * imagen del hero está decodificada, para no penalizar el LCP.
 */
export const features = {
  preloader: true,
  scrollProgress: true,
  magneticButtons: true,
  /**
   * Popup de captación al entrar. `entryPopupDelay` en milisegundos: no es
   * instantáneo a propósito, para no tapar la primera impresión del hero.
   * Ver `hooks/useWaitlistDialog.ts`.
   */
  entryPopup: true,
  entryPopupDelay: 3000,
  /** Distintivo de apertura fijo bajo la cabecera. */
  launchBadge: true,
  /**
   * Botón flotante de captación. `fabBubbleDelay` es lo que tarda en aparecer
   * el «escribiendo…» desde que arranca la cuenta, que empieza cuando no hay
   * ningún diálogo abierto por delante.
   */
  waitlistFab: true,
  fabBubbleDelay: 5000,
  /** Reel flotante, en la esquina opuesta al botón de la lista. */
  floatingReel: true,
} as const
