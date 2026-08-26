import type { ImageAsset } from '@/types'

/**
 * Catálogo de imágenes.
 *
 * ── Fotografía real ────────────────────────────────────────────────────────
 * El hero son las dos entregas del cliente: un mismo plano en dos encuadres,
 * con dirección de arte por dispositivo (horizontal en escritorio, vertical en
 * móvil). El resto son bodegones de marca, todos en 5:4, que el cliente aportó
 * como material de prelanzamiento.
 * `npm run images` genera los derivados AVIF/WebP desde `assets-source/`.
 *
 * ── Fotografía pendiente ───────────────────────────────────────────────────
 * Ninguna: hoy todas las piezas tienen foto real. El componente `Placeholder`
 * sigue en el sistema y `Media` admite `kind: 'placeholder'`, así que añadir un
 * hueco declarado para material futuro no exige tocar ninguna sección.
 *
 * PARA AÑADIR O SUSTITUIR UNA FOTO:
 *   1. Deja el master en `assets-source/<nombre>.png|jpg`.
 *   2. Añade una línea a `JOBS` en `scripts/generate-images.mjs`.
 *   3. Ejecuta `npm run images` y anota las dimensiones que imprime.
 *   4. Añade aquí el `ImageAsset` con esas dimensiones y su texto alternativo.
 * Ninguna sección hay que tocarla.
 */

/* ========================================================================== */
/* Fotografía entregada                                                        */
/* ========================================================================== */

export const heroDesktop: ImageAsset = {
  kind: 'image',
  name: 'hero-desktop',
  widths: [1024, 1280, 1600, 1920],
  width: 1920,
  height: 1080,
  alt: 'Invitada de Aruma Club sosteniendo un cóctel de autor frente a la barra, con la sala llena e iluminada en rojo.',
}

export const heroMobile: ImageAsset = {
  kind: 'image',
  name: 'hero-mobile',
  widths: [480, 640, 828, 1080, 1290],
  width: 1290,
  height: 2053,
  alt: 'Invitada de Aruma Club sosteniendo un cóctel de autor de la casa, con la barra iluminada en rojo al fondo.',
}

/* --- Bodegones de marca ---------------------------------------------------
   Los cuatro llegan en 5:4 y se sirven con esa proporción: recortarlos a 16:9
   o a 4:5 partía el objeto que da sentido a cada plano. */

export const vipCard: ImageAsset = {
  kind: 'image',
  name: 'vip-card',
  widths: [480, 720, 1080],
  width: 1080,
  height: 864,
  alt: 'Tarjeta de socio de Aruma Club en negro mate, con el logotipo y la palabra «member» grabados en rojo sobre mármol.',
}

export const barDetail: ImageAsset = {
  kind: 'image',
  name: 'bar-detail',
  widths: [480, 720, 1080],
  width: 1080,
  height: 864,
  alt: 'Posavasos con el logotipo de Aruma Club junto a un vaso tallado y una vela encendida sobre la barra de mármol.',
}

export const vipTable: ImageAsset = {
  kind: 'image',
  name: 'vip-table',
  widths: [640, 960, 1400],
  width: 1400,
  height: 1120,
  alt: 'Mesa reservada de Aruma Club con cubitera de marca, copas, vasos y el cartel de reservado.',
}

export const bottleService: ImageAsset = {
  kind: 'image',
  name: 'bottle-service',
  widths: [640, 960, 1400],
  width: 1400,
  height: 1120,
  alt: 'Cubitera de Aruma Club con hielo y botellas de champán y vodka bajo luz roja.',
}

export const guestsToast: ImageAsset = {
  kind: 'image',
  name: 'guests-toast',
  widths: [480, 720, 1080],
  width: 1080,
  height: 1080,
  alt: 'Invitada de Aruma Club brindando con un cóctel de autor en vaso de marca, con la sala llena al fondo.',
}

export const experienceMain: ImageAsset = {
  kind: 'image',
  name: 'guests-bar',
  widths: [640, 960, 1440],
  width: 1440,
  height: 960,
  alt: 'Tres invitadas de Aruma Club brindando en la barra bajo el rótulo iluminado del local.',
}

export const experienceDetail: ImageAsset = {
  kind: 'image',
  name: 'plaque',
  widths: [320, 480, 720],
  width: 720,
  height: 720,
  alt: 'Placa metálica de Aruma Club atornillada al muro, con el logotipo grabado y retroiluminado en rojo.',
}

export const cocktail: ImageAsset = {
  kind: 'image',
  name: 'cocktail-pour',
  widths: [480, 720, 1024],
  width: 1024,
  height: 1024,
  alt: 'Cóctel de autor sirviéndose desde la coctelera en una copa grabada con el logotipo de Aruma Club.',
}

export const entrance: ImageAsset = {
  kind: 'image',
  name: 'entrance',
  widths: [640, 960, 1440],
  width: 1440,
  height: 810,
  alt: 'Entrada de Aruma Club: una invitada accede al local desde la calle, con el rótulo de la marca iluminado en la pared.',
}

export const dancefloor: ImageAsset = {
  kind: 'image',
  name: 'dancing',
  widths: [480, 720, 1080],
  width: 1080,
  height: 1350,
  alt: 'Invitada de Aruma Club bailando con el brazo en alto, con el rótulo del local iluminado al fondo.',
}

export const guestsBottle: ImageAsset = {
  kind: 'image',
  name: 'guests-bottle',
  widths: [480, 720, 1080],
  width: 1080,
  height: 1350,
  alt: 'Tres invitadas de Aruma Club brindando en la barra junto a una cubitera de marca.',
}

export const guestPortrait: ImageAsset = {
  kind: 'image',
  name: 'guest-portrait',
  widths: [480, 720, 1080],
  width: 1080,
  height: 1424,
  alt: 'Invitada de Aruma Club en un reservado, con el rótulo del local retroiluminado al fondo.',
}

export const galleryRoom: ImageAsset = {
  kind: 'image',
  name: 'room',
  widths: [640, 960, 1440],
  width: 1440,
  height: 810,
  alt: 'Sala de Aruma Club llena durante la noche, bajo luz roja.',
}
