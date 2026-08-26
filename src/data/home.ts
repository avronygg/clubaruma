import { contact, launch } from '@/data/site'
import type { SectionContent } from '@/types'

/**
 * Contenido editorial de la home.
 *
 * ── Registro ───────────────────────────────────────────────────────────────
 * El club todavía no ha abierto. Todos los textos están escritos en clave de
 * prelanzamiento: nada promete un servicio que hoy no existe («ven esta
 * noche», «reserva ya»). Lo que se promete es la apertura o la lista.
 * Cuando abra, revisar las entradas marcadas con PRELANZAMIENTO.
 *
 * ── Voz ────────────────────────────────────────────────────────────────────
 * Se cuenta la noche por dentro y en presente: a qué hora llegas, qué pides,
 * qué tienes delante. El detalle concreto convence más que el adjetivo, y
 * además es lo único que distingue a este club de cualquier otro. Frases como
 * «coctelería cuidada» o «ambiente único» valen para todos, luego no valen
 * para ninguno.
 *
 * ⚠️ DATOS QUE EL CLIENTE TIENE QUE CONFIRMAR
 * Esa concreción tiene un precio: varias frases afirman cosas del local que
 * están escritas con criterio pero sin confirmar. Repásalas antes de publicar
 * y cámbialas si el club funciona de otra manera.
 *
 *   · `cocktails`  hielo tallado en casa, cítrico exprimido al momento, el
 *                  bartender prueba el trago antes de servirlo, se aceptan
 *                  encargos fuera de carta, un negroni tarda cuatro minutos.
 *   · `atmosphere` mesas de mármol negro, luz ámbar, velas, reservados con la
 *                  acústica separada de la pista.
 *   · `music`      house y latin house, DJ en vivo, cambio de ritmo de
 *                  madrugada.
 *   · `experience` el club sigue abierto a las tres.
 *
 * `title` es una tupla [texto, acento]: el acento se compone en cursiva serif
 * y en rojo. Es el recurso que da unidad a todas las secciones.
 *
 * Al migrar a CMS, este archivo es lo único que cambia de origen.
 */

export const hero = {
  /** El wordmark no se repite aquí: ya está en la navbar y grabado en el vaso. */
  eyebrow: 'Aruma Club',
  /**
   * El titular dice qué es y dónde; el distintivo flotante que hay justo
   * encima lleva el cuándo. La ciudad sale de `site.ts` para no tener el dato
   * en dos sitios.
   */
  title: ['Club Aruma abre', `en ${contact.shortCity}.`] as const,
  /**
   * Una sola línea, y en ella lo que de verdad hace elegir un sitio: quién
   * pincha y qué te vas a tomar.
   */
  body: 'Un DJ que sabe leer la pista y un trago que vale la espera.',
  primary: { label: 'Únete a la lista', href: '#lista' },
  secondary: { label: 'Descubre Aruma', href: '#experiencia' },
} as const

export const experience: SectionContent = {
  id: 'experiencia',
  index: '02',
  eyebrow: 'Tu primera noche',
  title: ['Llegas a las once', 'y ya no te vas.'],
  body: 'Pides la primera ronda mientras ubicas a los tuyos. A las doce la mesa está llena de vasos y alguien propone el brindis. A las tres sigues ahí, con la chaqueta olvidada en el respaldo.',
}

/** Ficha breve que acompaña a la sección de experiencia. */
export const experienceDetails = [
  { id: 'apertura', label: 'Apertura', value: launch.period },
  { id: 'musica', label: 'Música', value: 'DJ en vivo' },
  /** La política de edad va aquí y no en el titular: es un dato, no un reclamo. */
  { id: 'publico', label: 'Edad', value: 'Desde 25 años' },
  { id: 'donde', label: 'Ciudad', value: contact.shortCity },
] as const

export const cocktails: SectionContent = {
  id: 'cocteleria',
  index: '03',
  eyebrow: 'La barra',
  title: ['Cuatro minutos', 'para un negroni.'],
  body: 'El hielo lo tallan acá mismo y el cítrico se exprime cuando ya pediste el trago. El bartender lo prueba antes de pasártelo. ¿Quieres algo que no sale en la carta? Dilo y te lo hacen.',
  /** PRELANZAMIENTO: la carta se presenta en la apertura. */
  cta: { label: 'Únete a la lista VIP', href: '#lista' },
}

export const atmosphere: SectionContent = {
  id: 'ambiente',
  index: '04',
  eyebrow: 'El local',
  title: ['La mesa del fondo,', 'la que nadie suelta.'],
  body: 'Las mesas son de mármol negro y la luz tira a ámbar. La vela se refleja en el vaso mientras hablas. La pista suena fuerte y en los reservados todavía te escuchas con quien tienes al lado.',
}

export const vip: SectionContent = {
  id: 'vip',
  index: '05',
  eyebrow: 'Membresía',
  title: ['Entras primero', 'y ya tienes mesa.'],
  /** PRELANZAMIENTO — aquí se concreta qué significa «ser VIP». */
  body: 'Si dejas tus datos ahora, quedas en la lista VIP y eliges reservado para las noches de apertura. Botella en la mesa y hielo que llega antes de que lo pidas. En la puerta ya sabemos tu nombre.',
  cta: { label: 'Quiero mi acceso VIP', href: '#lista' },
}

export const music: SectionContent = {
  id: 'musica',
  index: '06',
  eyebrow: 'En la cabina',
  title: ['A las dos el DJ', 'cambia de marcha.'],
  body: 'Arranca suave, con algo que te deja conversar mientras llega tu gente. Después sube. House y latin house, con esos temas que te sabes sin querer y que suenan justo cuando toca.',
}

export const gallerySection = {
  id: 'galeria',
  index: '07',
  eyebrow: 'Por dentro',
  title: ['Así se ve Aruma', 'antes de abrir.'] as const,
  /** PRELANZAMIENTO */
  note: 'Las primeras fotos del local',
} as const

/**
 * Dónde está.
 *
 * En prelanzamiento la dirección hace tres cosas a la vez: quita de la cabeza
 * la duda de si esto es en Santiago, convierte el club en un sitio real al que
 * se puede ir, y el nombre del casino le presta al proyecto un respaldo que un
 * club sin abrir todavía no tiene por sí solo. Por eso el titular es el
 * recinto y la calle baja al párrafo.
 *
 * La dirección y los enlaces salen de `site.ts`.
 */
export const location = {
  id: 'donde',
  index: '08',
  eyebrow: 'Cómo llegar',
  title: ['Dentro del', `${contact.venue}.`] as const,
  body: `${contact.address}, ${contact.city}. Abre el mapa y te llevamos la ruta desde donde estés.`,
  cta: { label: 'Cómo llegar' },
  /** Etiqueta del mapa incrustado para lectores de pantalla. */
  mapTitle: `Ubicación de Aruma Club en ${contact.venue}, ${contact.city}`,
} as const

/**
 * Cierre de la home: es el objetivo real de toda la página.
 * PRELANZAMIENTO — captación de lista de espera.
 */
export const waitlist = {
  id: 'lista',
  index: '09',
  eyebrow: 'Lista VIP',
  title: ['Deja tus datos', 'y te guardamos un cupo.'] as const,
  body: 'La lista se abre antes que las puertas. El aforo manda y la inauguración se llena con los que ya están anotados. Si entras ahora, te llevas:',
  secondary: { label: 'Escríbenos por WhatsApp' },
} as const

/**
 * Beneficios de entrar en la lista. Los comparten el popup y la sección: es el
 * argumento de conversión, así que se dice lo mismo en los dos sitios.
 *
 * ⚠️ Son promesas comerciales y el club tendrá que cumplirlas una por una. Las
 * invitaciones van como sorteo entre la lista, no como regalo garantizado a
 * cada inscrito: cámbialo solo si el club está dispuesto a dárselas a todos.
 */
export const waitlistBenefits = [
  'Entras al sorteo de invitaciones para la inauguración',
  'Te avisamos la fecha antes de que se haga pública',
  'Preventa de entradas y noches privadas de socios',
] as const

/**
 * Textos del formulario. Los comparten la sección de cierre y el popup de
 * entrada: es el mismo componente, así que los datos que se captan son los
 * mismos vengan de donde vengan.
 */
export const waitlistForm = {
  fields: {
    nombre: { label: 'Nombre', placeholder: 'María', autoComplete: 'given-name' },
    apellido: { label: 'Apellido', placeholder: 'González', autoComplete: 'family-name' },
    email: { label: 'Correo electrónico', placeholder: 'maria@correo.com', autoComplete: 'email' },
    telefono: { label: 'Teléfono', placeholder: '+56 9 1234 5678', autoComplete: 'tel' },
  },
  errors: {
    nombre: 'Indica tu nombre.',
    apellido: 'Indica tu apellido.',
    email: 'Introduce un correo electrónico válido.',
    telefono: 'Introduce un teléfono válido.',
  },
  submit: 'Unirme a la lista VIP',
  submitting: 'Enviando…',
  success: 'Estás en la lista VIP. Te escribimos con la fecha.',
  error: 'No hemos podido registrarte. Inténtalo de nuevo o escríbenos por WhatsApp.',
  /** Visible mientras no haya un endpoint configurado. Ver `lib/waitlist.ts`. */
  demo: 'Modo demostración · pendiente de conectar',
  privacy: 'Solo te escribiremos por la apertura. Puedes darte de baja cuando quieras.',
} as const

/**
 * Reel flotante.
 * PRELANZAMIENTO — mensaje grabado invitando a entrar en la lista.
 */
export const reel = {
  title: 'Mensaje de Aruma Club',
  open: 'Ver el mensaje de Aruma Club',
  close: 'Cerrar vídeo',
  eyebrow: 'El adelanto',
  pitch: 'Dale play y mira lo que viene.',
  cta: 'Únete a la lista VIP',
} as const

/**
 * Botón flotante de captación.
 * PRELANZAMIENTO — segunda oportunidad para quien cerró el popup de entrada.
 */
export const waitlistFab = {
  open: 'Únete a la lista VIP',
  message: '¿Te anotamos en la lista VIP de Aruma?',
  dismiss: 'Cerrar mensaje',
} as const

/**
 * Popup de entrada.
 * PRELANZAMIENTO — es la captación principal mientras el club no abre.
 */
export const waitlistPopup = {
  eyebrow: 'La apertura',
  title: ['Aún estás a tiempo', 'de entrar a la lista.'] as const,
  body: 'Deja tus datos y quedas en la lista de apertura. Esto te llevas:',
  close: 'Cerrar',
  dismiss: 'Ahora no',
} as const
