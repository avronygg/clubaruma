/**
 * Alta en la lista VIP.
 *
 * La web está en prelanzamiento y su objetivo es captar contactos. El
 * formulario está construido y validado, pero **no hay backend**: se conecta
 * apuntando `VITE_WAITLIST_ENDPOINT` a un servicio que acepte un POST con JSON
 * (Formspree, Brevo, Mailchimp, una función serverless propia…).
 *
 *   # .env.local
 *   VITE_WAITLIST_ENDPOINT="https://…"
 *
 * Mientras no esté configurado, `submitWaitlist` devuelve `'unconfigured'` y la
 * interfaz lo dice en pantalla en lugar de fingir que ha guardado los datos.
 */

export type WaitlistResult = 'ok' | 'unconfigured'

/** De dónde salió el alta. Sirve para medir qué convierte mejor. */
export type WaitlistSource = 'popup' | 'seccion'

export type WaitlistLead = {
  nombre: string
  apellido: string
  email: string
  telefono: string
}

export type WaitlistField = keyof WaitlistLead

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT

/**
 * Validación deliberadamente permisiva: rechaza errores evidentes de tecleo
 * sin excluir direcciones válidas poco habituales. La comprobación real la
 * hace el correo de confirmación.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Mínimo de dígitos de un teléfono, ignorando prefijos, espacios y guiones. */
const MIN_PHONE_DIGITS = 8

export function isWaitlistConfigured(): boolean {
  return typeof ENDPOINT === 'string' && ENDPOINT.length > 0
}

/**
 * Devuelve el primer campo inválido de cada uno, o `null` si está bien.
 * No se valida el nombre contra ningún patrón: los nombres reales incluyen
 * partículas, apóstrofos, guiones y alfabetos que cualquier regex rechazaría.
 */
export function validateLead(lead: WaitlistLead): Partial<Record<WaitlistField, true>> {
  const errores: Partial<Record<WaitlistField, true>> = {}

  if (lead.nombre.trim().length < 2) errores.nombre = true
  if (lead.apellido.trim().length < 2) errores.apellido = true
  if (!EMAIL_PATTERN.test(lead.email.trim())) errores.email = true
  if (lead.telefono.replace(/\D/g, '').length < MIN_PHONE_DIGITS) errores.telefono = true

  return errores
}

export async function submitWaitlist(
  lead: WaitlistLead,
  source: WaitlistSource,
): Promise<WaitlistResult> {
  const endpoint = ENDPOINT
  if (!endpoint) return 'unconfigured'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      nombre: lead.nombre.trim(),
      apellido: lead.apellido.trim(),
      email: lead.email.trim(),
      telefono: lead.telefono.trim(),
      origen: source,
    }),
  })

  if (!response.ok) {
    throw new Error(`El servicio de lista VIP respondió ${response.status}`)
  }

  return 'ok'
}
